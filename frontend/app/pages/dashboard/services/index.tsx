import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import {
  fetchServices,
  deleteService,
  updateService,
  toggleServiceFeatured,
} from "~/redux/features/cmsSlice";
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
import { Wrench, Plus, Search, Trash2, Edit, Star, Briefcase, X } from "lucide-react";
import { TablePagination } from "~/components/ui/table-pagination";
import type { Service } from "~/types/cms";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0),
  featured: z.boolean(),
  isActive: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServicesList() {
  const dispatch = useAppDispatch();
  const { services, loading, error } = useAppSelector((state) => state.cms);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const itemsPerPage = 10;

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      icon: "",
      order: 0,
      featured: false,
      isActive: true,
    },
  });

  const isDirty = form.formState.isDirty;
  const editLoading = form.formState.isSubmitting;

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async () => {
    if (serviceToDelete) {
      await dispatch(deleteService(serviceToDelete));
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleToggleFeatured = async (service: Service) => {
    setTogglingId(service.id);
    try {
      await dispatch(toggleServiceFeatured(service.id)).unwrap();
    } finally {
      setTogglingId(null);
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingServiceId(service.id);
    form.reset({
      title: service.title,
      slug: service.slug,
      description: service.description || "",
      shortDescription: service.shortDescription || "",
      icon: service.icon || "",
      order: service.order || 0,
      featured: service.featured || false,
      isActive: service.isActive ?? true,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = (forced = false) => {
    if (isDirty && !forced) {
      setConfirmCloseOpen(true);
      return;
    }
    setEditDialogOpen(false);
    setEditingServiceId(null);
    form.reset();
  };

  const onEditSubmit = async (data: ServiceFormData) => {
    if (!editingServiceId) return;
    try {
      await dispatch(updateService({ id: editingServiceId, data })).unwrap();
      setEditDialogOpen(false);
      setEditingServiceId(null);
      form.reset();
    } catch {
      // Error is already in Redux state
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight !mb-0">Services</h1>
          <p className="text-black/70 mt-0.5 text-sm !mb-0">Manage your business services and offerings</p>
        </div>
        <Link to="/admin/services/create">
          <Button className="gap-2 shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold">All Services</span>
                <Badge variant="outline" className="ml-2">{filteredServices.length}</Badge>
              </div>
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Loading services...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-2 font-medium">Failed to load services</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchServices())}>Retry</Button>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No services found. Add your first service to get started.</p>
              <Link to="/admin/services/create">
                <Button><Plus className="w-4 h-4 mr-2" />Add Service</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {service.icon ? (
                              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                                {service.icon}
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <Wrench className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <span className="font-semibold text-foreground">{service.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded-md text-muted-foreground font-mono">
                            {service.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 gap-1.5 ${
                              service.featured
                                ? "text-amber-600 hover:bg-amber-500/10"
                                : "text-muted-foreground hover:bg-muted/50"
                            }`}
                            onClick={() => handleToggleFeatured(service)}
                            disabled={togglingId === service.id}
                          >
                            <Star className={`h-3.5 w-3.5 ${service.featured ? "fill-current" : ""}`} />
                            {service.featured ? "Featured" : "Not Featured"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge variant={service.isActive ? "success" : "destructive"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(service)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setServiceToDelete(service.id);
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
                        No services found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredServices.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, filteredServices.length)}</span> of{" "}
                    <span className="font-medium text-foreground">{filteredServices.length}</span> services
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
              Edit Service
            </DialogTitle>
            <DialogDescription>Update service details.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="Web Development" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl><Input placeholder="web-development" {...field} /></FormControl>
                    <FormDescription>URL-friendly identifier</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="shortDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl><Input placeholder="Brief summary of the service" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Detailed description..." rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="icon" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl><Input placeholder="Emoji or icon class" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="order" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl><Input type="number" min={0} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <FormField control={form.control} name="featured" render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured</FormLabel>
                      <FormDescription>Show in featured section</FormDescription>
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
                  {editLoading ? "Updating..." : "Update Service"}
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
              Delete Service
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this service? This action cannot be undone.</DialogDescription>
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
