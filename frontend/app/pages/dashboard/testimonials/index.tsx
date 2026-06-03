import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import {
  fetchTestimonials,
  deleteTestimonial,
  updateTestimonial,
  toggleTestimonialFeatured,
} from "~/redux/features/cmsSlice";
import {
  createTestimonialSchema,
  type CreateTestimonialFormData,
} from "~/utils/validations/testimonial";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
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
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Edit,
  Star,
  X,
} from "lucide-react";
import { TablePagination } from "~/components/ui/table-pagination";

export default function TestimonialList() {
  const dispatch = useAppDispatch();
  const { testimonials, loading, error } = useAppSelector((state) => state.cms);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const itemsPerPage = 10;

  const form = useForm<CreateTestimonialFormData>({
    resolver: zodResolver(createTestimonialSchema),
    defaultValues: {
      clientName: "",
      clientRole: "",
      company: "",
      content: "",
      rating: 5,
      image: "",
      featured: false,
      isActive: true,
    },
  });

  const isDirty = form.formState.isDirty;
  const editLoading = form.formState.isSubmitting;

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTestimonials.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async () => {
    if (testimonialToDelete) {
      await dispatch(deleteTestimonial(testimonialToDelete));
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    await dispatch(toggleTestimonialFeatured(id));
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  const openEditDialog = (t: typeof testimonials[0]) => {
    setEditingTestimonialId(t.id);
    form.reset({
      clientName: t.clientName,
      clientRole: t.clientRole || "",
      company: t.company || "",
      content: t.content,
      rating: t.rating || 5,
      image: t.image || "",
      featured: t.featured || false,
      isActive: t.isActive ?? true,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = (forced = false) => {
    if (isDirty && !forced) {
      setConfirmCloseOpen(true);
      return;
    }
    setEditDialogOpen(false);
    setEditingTestimonialId(null);
    form.reset();
  };

  const onEditSubmit = async (data: CreateTestimonialFormData) => {
    if (!editingTestimonialId) return;
    const result = await dispatch(updateTestimonial({ id: editingTestimonialId, data }));
    if (updateTestimonial.fulfilled.match(result)) {
      setEditDialogOpen(false);
      setEditingTestimonialId(null);
      form.reset();
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight !mb-0">Testimonials</h1>
          <p className="text-black/70 mt-0.5 text-sm !mb-0">Manage client testimonials and reviews</p>
        </div>
        <Link to="/admin/testimonials/create">
          <Button className="gap-2 shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/10">
                <MessageSquare className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <span className="text-lg font-semibold">All Testimonials</span>
                <Badge variant="outline" className="ml-2">{filteredTestimonials.length}</Badge>
              </div>
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search testimonials..."
                className="pl-[34px]"
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
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-2 font-medium">Failed to load testimonials</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchTestimonials())}>Retry</Button>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No testimonials found. Add your first testimonial to get started.</p>
              <Link to="/admin/testimonials/create">
                <Button><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {t.image ? (
                              <img src={t.image} alt={t.clientName} className="w-9 h-9 rounded-full object-cover ring-2 ring-border/50" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center ring-2 ring-border/50">
                                <span className="text-xs font-bold text-pink-700">
                                  {t.clientName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-foreground">{t.clientName}</span>
                              {t.clientRole && (
                                <p className="text-xs text-muted-foreground">{t.clientRole}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="text-muted-foreground text-sm">{truncateContent(t.content, 80)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 gap-1.5 ${
                              t.featured
                                ? "text-amber-600 hover:bg-amber-500/10"
                                : "text-muted-foreground hover:bg-muted/50"
                            }`}
                            onClick={() => handleToggleFeatured(t.id)}
                          >
                            <Star className={`h-3.5 w-3.5 ${t.featured ? "fill-current" : ""}`} />
                            {t.featured ? "Featured" : "Not Featured"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(t)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setTestimonialToDelete(t.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        No testimonials found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredTestimonials.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, filteredTestimonials.length)}</span> of{" "}
                    <span className="font-medium text-foreground">{filteredTestimonials.length}</span> testimonials
                  </p>
                  <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { if (!open) handleEditClose(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => { if (isDirty) e.preventDefault(); }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit Testimonial
            </DialogTitle>
            <DialogDescription>Update testimonial details.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="clientName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="clientRole" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl><Input placeholder="CEO" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl><Input placeholder="Company name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl><Textarea placeholder="Testimonial content..." rows={5} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="rating" render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating ({field.value}/5)</FormLabel>
                  <FormControl>
                    <Input type="range" min={1} max={5} {...field} />
                  </FormControl>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < field.value ? "fill-primary text-primary" : "text-muted"}`} />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="space-y-4">
                <FormField control={form.control} name="featured" render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured</FormLabel>
                      <FormDescription>Show on homepage</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Make visible to users</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => handleEditClose()} disabled={editLoading}>
                  {isDirty ? "Cancel" : "Close"}
                </Button>
                <Button type="submit" disabled={editLoading || !isDirty}>
                  {editLoading ? "Updating..." : "Update Testimonial"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirm Close Dialog */}
      <Dialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10"><X className="h-4 w-4 text-amber-600" /></div>
              Unsaved Changes
            </DialogTitle>
            <DialogDescription>You have unsaved changes. Are you sure you want to close without saving?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCloseOpen(false)}>Keep Editing</Button>
            <Button variant="destructive" onClick={() => { setConfirmCloseOpen(false); handleEditClose(true); }}>Discard Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></div>
              Delete Testimonial
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this testimonial? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
