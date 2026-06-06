import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import {
  fetchProjects,
  deleteProject,
  toggleProjectFeatured,
} from "~/redux/features/cmsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
import { FolderOpen, Plus, Search, Trash2, Edit, Star, FolderGit2 } from "lucide-react";
import { TablePagination } from "~/components/ui/table-pagination";

export default function ProjectList() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.cms);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const itemsPerPage = 10;

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
      const project = projects.find((p) => p.id === projectToDelete);
      const result = await dispatch(deleteProject(projectToDelete));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      if (deleteProject.fulfilled.match(result)) {
        toast.success("Project deleted", {
          description: `"${project?.title || "Project"}" has been removed.`,
        });
      } else {
        toast.error("Failed to delete project", {
          description: "Something went wrong. Please try again.",
        });
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    setTogglingId(id);
    const result = await dispatch(toggleProjectFeatured(id));
    setTogglingId(null);
    const project = projects.find((p) => p.id === id);
    if (toggleProjectFeatured.fulfilled.match(result)) {
      const isFeatured = result.payload?.featured ?? !project?.featured;
      toast.success(isFeatured ? "Project featured" : "Project unfeatured", {
        description: `"${project?.title || "Project"}" has been ${isFeatured ? "added to" : "removed from"} featured projects.`,
      });
    } else {
      toast.error("Failed to update featured status", {
        description: "Something went wrong. Please try again.",
      });
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
                <span className="text-lg font-semibold text-black">All Projects</span>
                <Badge variant="outline" className="ml-2 text-black">{filteredProjects.length}</Badge>
              </div>
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
              <Input
                placeholder="Search projects..."
                className="pl-[34px] text-black placeholder:text-black/50"
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
              <p className="text-black/60 text-sm">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-2 font-medium">Failed to load projects</p>
              <p className="text-black/60 text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchProjects())}>Retry</Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-black/50" />
              </div>
              <p className="text-black/60 mb-4">No projects found. Add your first project to get started.</p>
              <Link to="/admin/projects/create">
                <Button><Plus className="w-4 h-4 mr-2" />Add Project</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black/70">Project</TableHead>
                    <TableHead className="text-black/70">Slug</TableHead>
                    <TableHead className="text-black/70">Category</TableHead>
                    <TableHead className="text-black/70">Featured</TableHead>
                    <TableHead className="text-right text-black/70">Actions</TableHead>
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
                              <span className="font-semibold text-black">{project.title}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded-md text-black/60 font-mono">
                            /{project.slug}
                          </code>
                        </TableCell>
                        <TableCell className="text-black/60">{project.category || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 gap-1.5 ${
                              project.featured
                                ? "text-amber-600 hover:bg-amber-500/10"
                                : "text-black/50 hover:bg-muted/50"
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
                            <Link to={`/admin/projects/edit/${project.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-black/70 hover:text-black">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
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
                      <TableCell colSpan={5} className="text-center py-12 text-black/60">
                        No projects found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredProjects.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                  <p className="text-sm text-black/60">
                    Showing <span className="font-medium text-black">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-black">{Math.min(indexOfLastItem, filteredProjects.length)}</span> of{" "}
                    <span className="font-medium text-black">{filteredProjects.length}</span> projects
                  </p>
                  <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black">
              <div className="p-1.5 rounded-lg bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></div>
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-black/60">Are you sure you want to delete this project? This action cannot be undone.</DialogDescription>
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
