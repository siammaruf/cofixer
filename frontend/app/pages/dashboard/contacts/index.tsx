import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import {
  fetchContacts,
  updateContactStatus,
  deleteContact,
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
  Mail,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Inbox,
  MailOpen,
} from "lucide-react";
import { TablePagination } from "~/components/ui/table-pagination";
import type { ContactMessage } from "~/types/cms";

type StatusFilter = "all" | "read" | "unread";

export default function ContactsDashboard() {
  const dispatch = useAppDispatch();
  const { contacts, loading, error } = useAppSelector((state) => state.cms);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && contact.read) ||
      (statusFilter === "unread" && !contact.read);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const unreadCount = contacts.filter((c) => !c.read).length;

  const handleDelete = async () => {
    if (contactToDelete) {
      setActionLoading(true);
      await dispatch(deleteContact(contactToDelete));
      setActionLoading(false);
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  const handleToggleRead = async (contact: ContactMessage) => {
    setActionLoading(true);
    await dispatch(updateContactStatus({ id: contact.id, data: { read: !contact.read } }));
    setActionLoading(false);
  };

  const handleViewDetails = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
    if (!contact.read) {
      dispatch(updateContactStatus({ id: contact.id, data: { read: true } }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateSubject = (subject: string, maxLength = 40) => {
    return subject.length > maxLength ? `${subject.slice(0, maxLength)}...` : subject;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight !mb-0">Contact Inbox</h1>
          <p className="text-black/70 mt-0.5 text-sm !mb-0">Manage and respond to contact form submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Inbox className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-3xl font-bold text-black tracking-tight">{contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <MailOpen className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-3xl font-bold text-black tracking-tight">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold">All Messages</span>
                <Badge variant="outline" className="ml-2">{filteredContacts.length}</Badge>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-[34px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-1 border border-border rounded-xl p-1 bg-card">
                <Button
                  variant={statusFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
                >
                  <Filter className="h-3 w-3 mr-1" />All
                </Button>
                <Button
                  variant={statusFilter === "unread" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => { setStatusFilter("unread"); setCurrentPage(1); }}
                >
                  Unread
                </Button>
                <Button
                  variant={statusFilter === "read" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => { setStatusFilter("read"); setCurrentPage(1); }}
                >
                  Read
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Loading messages...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-2 font-medium">Failed to load messages</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchContacts())}>Retry</Button>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No messages yet. Contact form submissions will appear here.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sender</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((contact) => (
                      <TableRow
                        key={contact.id}
                        className={!contact.read ? "bg-primary/5 hover:bg-primary/10" : ""}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 ring-2 ring-border/50">
                              <span className="text-xs font-bold text-primary">
                                {contact.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                              </span>
                            </div>
                            <span className="font-semibold text-foreground">{contact.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate font-mono text-xs">{contact.email}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[250px]">
                          <Button variant="link" size="sm" className="p-0 h-auto font-medium text-left" onClick={() => handleViewDetails(contact)}>
                            {truncateSubject(contact.subject)}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge variant={contact.read ? "secondary" : "default"}>
                            {contact.read ? "Read" : "Unread"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{formatDate(contact.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(contact)} title="View details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleRead(contact)}
                              disabled={actionLoading}
                              title={contact.read ? "Mark as unread" : "Mark as read"}
                            >
                              {contact.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => { setContactToDelete(contact.id); setDeleteDialogOpen(true); }}
                              disabled={actionLoading}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No messages found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredContacts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, filteredContacts.length)}</span> of{" "}
                    <span className="font-medium text-foreground">{filteredContacts.length}</span> messages
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
              Delete Message
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this message? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>{actionLoading ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-black">{selectedContact?.subject}</DialogTitle>
              <Badge variant={selectedContact?.read ? "secondary" : "default"}>
                {selectedContact?.read ? "Read" : "Unread"}
              </Badge>
            </div>
            <DialogDescription className="space-y-2 pt-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">From:</span>
                <span>{selectedContact?.name}</span>
                <span className="text-muted-foreground font-mono text-xs">({selectedContact?.email})</span>
              </div>
              {selectedContact?.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Phone:</span>
                  <span>{selectedContact.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Date:</span>
                <span>{selectedContact ? formatDate(selectedContact.createdAt) : ""}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border/50">
            <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">{selectedContact?.message}</p>
          </div>
          {selectedContact?.notes && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground mb-2">Internal Notes</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedContact.notes}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { if (selectedContact) handleToggleRead(selectedContact); }}
              disabled={actionLoading}
            >
              {selectedContact?.read ? <><EyeOff className="h-4 w-4 mr-2" />Mark as Unread</> : <><Eye className="h-4 w-4 mr-2" />Mark as Read</>}
            </Button>
            <Button
              variant="destructive"
              onClick={() => { if (selectedContact) { setViewDialogOpen(false); setContactToDelete(selectedContact.id); setDeleteDialogOpen(true); } }}
              disabled={actionLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
