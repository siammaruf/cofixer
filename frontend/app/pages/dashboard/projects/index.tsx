import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import {
  fetchProjects,
  deleteProject,
  updateProject,
  toggleProjectFeatured,
} from "~/redux/features/cmsSlice";
import {
  createProjectSchema,
  type CreateProjectFormData,
} from "~/utils/validations/project";
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
import { FolderOpen, Plus, Search, Trash2, Edit, Star, ExternalLink, Github, FolderGit2, X } from "lucide-react";
import { TablePagination } from "~/components/ui/table-pagination";

export default function ProjectList() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.cms);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const itemsPerPage = 10;

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      techStack: [],
      featured: false,
    },
  });

  const isDirty = form.formState.isDirty;
  const editLoading = form.formState.isSubmitting;

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async () => {
    if (projectToDelete) {
      await dispatch(deleteProject(projectToDelete));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    setTogglingId(id);
    await dispatch(toggleProjectFeatured(id));
    setTogglingId(null);
  };

  const openEditDialog = (project: typeof projects[0]) => {
    setEditingProjectId(project.id);
    form.reset({
      title: project.title,
      slug: project.slug,
      description: project.description || "",
      imageUrl: project.featuredImage || project.imageUrl || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      techStack: project.techStack || [],
      featured: project.featured || false,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = (forced = false) => {
    if (isDirty && !forced) {
      setConfirmCloseOpen(true);
      return;
    }
    setEditDialogOpen(false);
    setEditingProjectId(null);
    form.reset();
  };

  const onEditSubmit = async (data: CreateProjectFormData) => {
    if (!editingProjectId) return;
    const result = await dispatch(
      updateProject({
        id: editingProjectId,
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description || undefined,
          featuredImage: data.imageUrl || undefined,
          imageUrl: data.imageUrl || undefined,
          liveUrl: data.liveUrl || undefined,
          githubUrl: data.githubUrl || undefined,
          techStack: data.techStack,
          featured: data.featured,
        },
      })
    );
    if (updateProject.fulfilled.match(result)) {
      setEditDialogOpen(false);
      setEditingProjectId(null);
      form.reset();
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight !mb-0">Projects</h1>
          <p className="text-black/70 mt-0.5 text-sm !mb-0">Manage your portfolio projects and case studies</p>
        </div>
        <Link to="/admin/projects/create">
          <Button className="gap-2 shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <FolderGit2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-lg font-semibold">All Projects</span>
                <Badge variant="outline" className="ml-2">{filteredProjects.length}</Badge>
              </div>
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
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
              <p className="text-muted-foreground text-sm">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-2 font-medium">Failed to load projects</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchProjects())}>Retry</Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No projects found. Add your first project to get started.</p>
              <Link to="/admin/projects/create">
                <Button><Plus className="w-4 h-4 mr-2" />Add Project</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {project.featuredImage || project.imageUrl ? (
                              <img
                                src={project.featuredImage || project.imageUrl}
                                alt={project.title}
                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-border/50"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-foreground">{project.title}</span>
                              <div className="flex items-center gap-2 mt-1">
                                {project.liveUrl && (
                                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}
                                {project.githubUrl && (
                                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <Github className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded-md text-muted-foreground font-mono">
                            /{project.slug}
                          </code>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{project.category || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 gap-1.5 ${
                              project.featured
                                ? "text-amber-600 hover:bg-amber-500/10"
                                : "text-muted-foreground hover:bg-muted/50"
                            }`}
                            onClick={() => handleToggleFeatured(project.id)}
                            disabled={togglingId === project.id}
                          >
                            <Star className={`h-3.5 w-3.5 ${project.featured ? "fill-current" : ""}`} />
                            {project.featured ? "Featured" : "Not Featured"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(project)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setProjectToDelete(project.id);
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
                        No projects found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredProjects.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, filteredProjects.length)}</span> of{" "}
                    <span className="font-medium text-foreground">{filteredProjects.length}</span> projects
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
              Edit Project
            </DialogTitle>
            <DialogDescription>Update project details.</DialogDescription>
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
                    <FormControl><Input placeholder="Project title" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl><Input placeholder="project-slug" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Project description..." rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="liveUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="githubUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

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

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => handleEditClose()} disabled={editLoading}>
                  {isDirty ? "Cancel" : "Close"}
                </Button>
                <Button type="submit" disabled={editLoading || !isDirty}>
                  {editLoading ? "Updating..." : "Update Project"}
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
              Delete Project
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this project? This action cannot be undone.</DialogDescription>
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
