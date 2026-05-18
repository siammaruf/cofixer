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
  ChevronLeft,
  ChevronRight,
  Filter,
  Inbox,
  MailOpen,
} from "lucide-react";
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
    await dispatch(
      updateContactStatus({
        id: contact.id,
        data: { read: !contact.read },
      })
    );
    setActionLoading(false);
  };

  const handleViewDetails = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
    if (!contact.read) {
      dispatch(
        updateContactStatus({
          id: contact.id,
          data: { read: true },
        })
      );
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
    return subject.length > maxLength
      ? `${subject.slice(0, maxLength)}...`
      : subject;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contact Inbox</h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to contact form submissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Inbox className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-white">{contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <MailOpen className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold text-white">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5 text-primary" />
              <span>All Messages</span>
              <Badge variant="secondary" className="ml-2">
                {filteredContacts.length}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-1 border border-border rounded-md p-1">
                <Button
                  variant={statusFilter === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  All
                </Button>
                <Button
                  variant={statusFilter === "unread" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setStatusFilter("unread");
                    setCurrentPage(1);
                  }}
                >
                  Unread
                </Button>
                <Button
                  variant={statusFilter === "read" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setStatusFilter("read");
                    setCurrentPage(1);
                  }}
                >
                  Read
                </Button>
              </div>
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
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-2">Failed to load messages</p>
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => dispatch(fetchContacts())}
              >
                Retry
              </Button>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No messages yet. Contact form submissions will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
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
                          className={`border-border ${
                            !contact.read
                              ? "bg-primary/5 hover:bg-primary/10"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-semibold text-primary">
                                  {contact.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </span>
                              </div>
                              <span className="font-medium text-white">
                                {contact.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px] truncate">
                            {contact.email}
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[250px]">
                            <button
                              className="hover:text-white transition-colors text-left"
                              onClick={() => handleViewDetails(contact)}
                            >
                              {truncateSubject(contact.subject)}
                            </button>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                contact.read ? "secondary" : "default"
                              }
                            >
                              {contact.read ? "Read" : "Unread"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {formatDate(contact.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewDetails(contact)}
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleToggleRead(contact)}
                                disabled={actionLoading}
                                title={
                                  contact.read
                                    ? "Mark as unread"
                                    : "Mark as read"
                                }
                              >
                                {contact.read ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setContactToDelete(contact.id);
                                  setDeleteDialogOpen(true);
                                }}
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
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No messages found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredContacts.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredContacts.length)} of{" "}
                    {filteredContacts.length} messages
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
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={
                        currentPage === totalPages || totalPages === 0
                      }
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white">
                {selectedContact?.subject}
              </DialogTitle>
              <Badge
                variant={selectedContact?.read ? "secondary" : "default"}
              >
                {selectedContact?.read ? "Read" : "Unread"}
              </Badge>
            </div>
            <DialogDescription className="space-y-1 pt-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">From:</span>
                <span>{selectedContact?.name}</span>
                <span className="text-muted-foreground">
                  ({selectedContact?.email})
                </span>
              </div>
              {selectedContact?.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Phone:</span>
                  <span>{selectedContact.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Date:</span>
                <span>
                  {selectedContact
                    ? formatDate(selectedContact.createdAt)
                    : ""}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-foreground whitespace-pre-wrap">
              {selectedContact?.message}
            </p>
          </div>
          {selectedContact?.notes && (
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-1">
                Internal Notes
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedContact.notes}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedContact) {
                  handleToggleRead(selectedContact);
                }
              }}
              disabled={actionLoading}
            >
              {selectedContact?.read ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Mark as Unread
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Mark as Read
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedContact) {
                  setViewDialogOpen(false);
                  setContactToDelete(selectedContact.id);
                  setDeleteDialogOpen(true);
                }
              }}
              disabled={actionLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
