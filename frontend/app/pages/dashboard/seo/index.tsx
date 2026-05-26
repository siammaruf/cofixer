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
import { Search, Edit, Globe, CheckCircle, AlertCircle } from "lucide-react";
import { TablePagination } from "~/components/ui/table-pagination";
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
    defaultValues: { title: "", metaDescription: "", metaKeywords: "", ogTitle: "", ogDescription: "", ogImage: "" },
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
    const keywords = data.metaKeywords ? data.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean) : [];
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
      setTimeout(() => { setEditDialogOpen(false); setSaveSuccess(false); }, 1200);
    }
  };

  const truncate = (text: string | undefined, maxLength: number) => {
    if (!text) return "-";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">SEO Settings</h1>
        <p className="text-black/70 mt-0.5 text-sm">Manage meta tags and Open Graph settings for each page</p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-lg font-semibold">All Pages</span>
                <Badge variant="outline" className="ml-2">{filteredSeo.length}</Badge>
              </div>
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                className="pl-[34px]"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Loading SEO settings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-2 font-medium">Failed to load SEO settings</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchSeoSettings())}>Retry</Button>
            </div>
          ) : seoList.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No SEO settings found.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableRow key={seo.id}>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-mono">{seo.pageType}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{seo.route}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="text-sm text-foreground truncate">{seo.title || <span className="text-muted-foreground italic">Not set</span>}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[250px]">
                            <p className="text-sm text-muted-foreground truncate">{truncate(seo.metaDescription, 80)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(seo)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        No pages found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredSeo.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, filteredSeo.length)}</span> of{" "}
                    <span className="font-medium text-foreground">{filteredSeo.length}</span> pages
                  </p>
                  <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10"><Edit className="h-4 w-4 text-primary" /></div>
              Edit SEO Settings
            </DialogTitle>
            <DialogDescription>
              {editingSeo && (
                <span>Updating SEO for <code className="text-foreground font-mono">{editingSeo.route}</code> ({editingSeo.pageType})</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <p className="text-sm text-emerald-700 font-medium">SEO settings updated successfully</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && !saveSuccess && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-black uppercase tracking-wide">Meta Tags</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl><Input placeholder="Page title for search engines" {...field} /></FormControl>
                      <div className="flex justify-between"><FormMessage /><span className="text-xs text-muted-foreground">{field.value?.length ?? 0}/70</span></div>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="metaDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl><Textarea placeholder="Brief description for search results" rows={3} {...field} /></FormControl>
                      <div className="flex justify-between"><FormMessage /><span className="text-xs text-muted-foreground">{field.value?.length ?? 0}/160</span></div>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="metaKeywords" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl><Input placeholder="keyword1, keyword2, keyword3" {...field} /></FormControl>
                      <FormDescription>Separate keywords with commas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-black uppercase tracking-wide">Open Graph</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField control={form.control} name="ogTitle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Title</FormLabel>
                      <FormControl><Input placeholder="Title for social media sharing" {...field} /></FormControl>
                      <div className="flex justify-between"><FormMessage /><span className="text-xs text-muted-foreground">{field.value?.length ?? 0}/70</span></div>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="ogDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Description</FormLabel>
                      <FormControl><Textarea placeholder="Description for social media sharing" rows={2} {...field} /></FormControl>
                      <div className="flex justify-between"><FormMessage /><span className="text-xs text-muted-foreground">{field.value?.length ?? 0}/200</span></div>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="ogImage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Image URL</FormLabel>
                      <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving..." : "Save Changes"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
