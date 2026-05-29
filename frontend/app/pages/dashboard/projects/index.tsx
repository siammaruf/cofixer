import { useEffect, useState } from "react";
import { Link } from "react-router";
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
import { FolderOpen, Plus, Search, Trash2, Edit, Star, ExternalLink, Github, FolderGit2 } from "lucide-react";
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
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
