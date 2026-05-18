import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchSeoSettings, updateSeoSettings } from "~/redux/features/cmsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Search, Edit, ChevronLeft, ChevronRight, Globe, CheckCircle, AlertCircle } from "lucide-react";
import type { SeoSettings } from "~/types/cms";

const seoEditSchema = z.object({
  title: z.string().max(70, "Meta title must be 70 characters or fewer").optional(),
  metaDescription: z.string().max(160, "Meta description must be 160 characters or fewer").optional(),
  metaKeywords: z.string().optional(),
  ogTitle: z.string().max(70, "OG title must be 70 characters or fewer").optional(),
  ogDescription: z.string().max(200, "OG description must be 200 characters or fewer").optional(),
  ogImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type SeoEditFormData = z.infer<typeof seoEditSchema>;

export default function SeoDashboard() {
  const dispatch = useAppDispatch();
  const { seoSettings: seoList, loading, error } = useAppSelector((state) => state.cms);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSeo, setEditingSeo] = useState<SeoSettings | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchSeoSettings());
  }, [dispatch]);

  const filteredSeo = seoList.filter(
    (seo) =>
      seo.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seo.pageType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seo.metaDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSeo.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSeo.slice(indexOfFirstItem, indexOfLastItem);

  const form = useForm<SeoEditFormData>({
    resolver: zodResolver(seoEditSchema),
    defaultValues: {
      title: "",
      metaDescription: "",
      metaKeywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
    },
    mode: "onChange",
  });

  const handleEdit = (seo: SeoSettings) => {
    setEditingSeo(seo);
    setSaveSuccess(false);
    form.reset({
      title: seo.title ?? "",
      metaDescription: seo.metaDescription ?? "",
      metaKeywords: seo.metaKeywords?.join(", ") ?? "",
      ogTitle: seo.ogTitle ?? "",
      ogDescription: seo.ogDescription ?? "",
      ogImage: seo.ogImage ?? "",
    });
    setEditDialogOpen(true);
  };

  const onSubmit = async (data: SeoEditFormData) => {
    if (!editingSeo) return;

    const keywords = data.metaKeywords
      ? data.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const result = await dispatch(
      updateSeoSettings({
        route: editingSeo.route,
        data: {
          title: data.title || undefined,
          metaDescription: data.metaDescription || undefined,
          metaKeywords: keywords.length > 0 ? keywords : undefined,
          ogTitle: data.ogTitle || undefined,
          ogDescription: data.ogDescription || undefined,
          ogImage: data.ogImage || undefined,
        },
      })
    );

    if (updateSeoSettings.fulfilled.match(result)) {
      setSaveSuccess(true);
      setTimeout(() => {
        setEditDialogOpen(false);
        setSaveSuccess(false);
      }, 1200);
    }
  };

  const truncate = (text: string | undefined, maxLength: number) => {
    if (!text) return "-";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO Settings</h1>
        <p className="text-muted-foreground mt-1">Manage meta tags and Open Graph settings for each page</p>
      </div>

      {/* Main Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Globe className="h-5 w-5 text-primary" />
              <span>All Pages</span>
              <Badge variant="secondary" className="ml-2">{filteredSeo.length}</Badge>
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="relative mx-auto mb-4" style={{ width: 40, height: 40 }}>
                  <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin border-t-primary border-b-secondary" />
                </div>
                <p className="text-muted-foreground">Loading SEO settings...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-2">Failed to load SEO settings</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchSeoSettings())}>
                Retry
              </Button>
            </div>
          ) : seoList.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No SEO settings found.</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Page</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Meta Title</TableHead>
                      <TableHead>Meta Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((seo) => (
                        <TableRow key={seo.id} className="border-border">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-mono">
                                {seo.pageType}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {seo.route}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <p className="text-sm text-foreground truncate">
                                {seo.title || <span className="text-muted-foreground italic">Not set</span>}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[250px]">
                              <p className="text-sm text-muted-foreground truncate">
                                {truncate(seo.metaDescription, 80)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(seo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No pages found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredSeo.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSeo.length)} of {filteredSeo.length} pages
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit SEO Settings
            </DialogTitle>
            <DialogDescription>
              {editingSeo && (
                <span>
                  Updating SEO for <code className="text-foreground font-mono">{editingSeo.route}</code> ({editingSeo.pageType})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-green-500">SEO settings updated successfully</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && !saveSuccess && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Meta Tags</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Page title for search engines" {...field} />
                        </FormControl>
                        <div className="flex justify-between">
                          <FormMessage />
                          <span className="text-xs text-muted-foreground">
                            {field.value?.length ?? 0}/70
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description for search results"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          <FormMessage />
                          <span className="text-xs text-muted-foreground">
                            {field.value?.length ?? 0}/160
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Keywords</FormLabel>
                        <FormControl>
                          <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                        </FormControl>
                        <FormDescription>Separate keywords with commas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Open Graph</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="ogTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Title for social media sharing" {...field} />
                        </FormControl>
                        <div className="flex justify-between">
                          <FormMessage />
                          <span className="text-xs text-muted-foreground">
                            {field.value?.length ?? 0}/70
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ogDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description for social media sharing"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          <FormMessage />
                          <span className="text-xs text-muted-foreground">
                            {field.value?.length ?? 0}/200
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ogImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
