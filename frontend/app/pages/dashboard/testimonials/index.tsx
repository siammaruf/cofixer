import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import {
  fetchTestimonials,
  deleteTestimonial,
  toggleTestimonialFeatured,
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
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Edit,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TestimonialList() {
  const dispatch = useAppDispatch();
  const { testimonials, loading, error } = useAppSelector((state) => state.cms);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const itemsPerPage = 10;

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage client testimonials and reviews</p>
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
                className="pl-10"
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
                          <button
                            onClick={() => handleToggleFeatured(t.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              t.featured
                                ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            <Star className={`h-3.5 w-3.5 ${t.featured ? "fill-current" : ""}`} />
                            {t.featured ? "Featured" : "Not Featured"}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, filteredTestimonials.length)}</span> of{" "}
                    <span className="font-medium text-foreground">{filteredTestimonials.length}</span> testimonials
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4 mr-1" />Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">Page {currentPage} of {totalPages || 1}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>
                      Next<ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
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
