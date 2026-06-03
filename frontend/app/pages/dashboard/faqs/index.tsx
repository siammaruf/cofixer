import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchFaqs, updateFaq, deleteFaq } from "~/redux/features/cmsSlice";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { HelpCircle, Plus, Search, Trash2, Edit, Loader2, X } from "lucide-react";
import { TablePagination } from "~/components/ui/table-pagination";

const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Question must be less than 500 characters"),
  answer: z.string().min(1, "Answer is required").max(5000, "Answer must be less than 5000 characters"),
  category: z.string().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
});

type FaqFormData = z.infer<typeof faqSchema>;

export default function FaqList() {
  const dispatch = useAppDispatch();
  const { faqs, loading, error } = useAppSelector((state) => state.cms);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const itemsPerPage = 10;

  const form = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      order: 0,
      isActive: true,
    },
  });

  const isDirty = form.formState.isDirty;
  const editLoading = form.formState.isSubmitting;

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async () => {
    if (faqToDelete) {
      await dispatch(deleteFaq(faqToDelete));
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  const openEditDialog = (faq: typeof faqs[0]) => {
    setEditingFaqId(faq.id);
    form.reset({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      order: faq.order || 0,
      isActive: faq.isActive ?? true,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = (forced = false) => {
    if (isDirty && !forced) {
      setConfirmCloseOpen(true);
      return;
    }
    setEditDialogOpen(false);
    setEditingFaqId(null);
    form.reset();
  };

  const onEditSubmit = async (data: FaqFormData) => {
    if (!editingFaqId) return;
    const result = await dispatch(updateFaq({ id: editingFaqId, data }));
    if (updateFaq.fulfilled.match(result)) {
      setEditDialogOpen(false);
      setEditingFaqId(null);
      form.reset();
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight !mb-0">FAQs</h1>
          <p className="text-black/70 mt-0.5 text-sm !mb-0">Manage frequently asked questions and answers</p>
        </div>
        <Link to="/admin/faqs/create">
          <Button className="gap-2 shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        </Link>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10">
                <HelpCircle className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <span className="text-lg font-semibold">All FAQs</span>
                <Badge variant="outline" className="ml-2">{filteredFaqs.length}</Badge>
              </div>
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
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
              <p className="text-muted-foreground text-sm">Loading FAQs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-2 font-medium">Failed to load FAQs</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchFaqs())}>Retry</Button>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No FAQs found. Add your first FAQ to get started.</p>
              <Link to="/admin/faqs/create">
                <Button><Plus className="w-4 h-4 mr-2" />Add FAQ</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="font-semibold text-foreground truncate">{faq.question}</p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{faq.answer}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {faq.category ? (
                            <Badge variant="info">{faq.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={faq.isActive ? "success" : "destructive"}>
                            {faq.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(faq)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setFaqToDelete(faq.id);
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
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                        No FAQs found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredFaqs.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, filteredFaqs.length)}</span> of{" "}
                    <span className="font-medium text-foreground">{filteredFaqs.length}</span> FAQs
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
            <DialogTitle className="flex items-center gap-2 text-black">
              <Edit className="h-5 w-5 text-primary" />
              Edit FAQ
            </DialogTitle>
            <DialogDescription>Update the frequently asked question and answer.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <FormField control={form.control} name="question" render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl><Input placeholder="Enter the FAQ question" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="answer" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Answer</FormLabel>
                  <FormControl><Textarea placeholder="Enter the FAQ answer" rows={5} className="text-black" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input placeholder="e.g., Billing, General, Technical" {...field} /></FormControl>
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

              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={field.onChange} className="accent-primary h-4 w-4" />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">Active</FormLabel>
                </FormItem>
              )} />

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => handleEditClose()} disabled={editLoading}>
                  {isDirty ? "Cancel" : "Close"}
                </Button>
                <Button type="submit" disabled={editLoading || !isDirty}>
                  {editLoading ? "Updating..." : "Update FAQ"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirm Close Dialog (when dirty) */}
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
              Delete FAQ
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this FAQ? This action cannot be undone.</DialogDescription>
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
