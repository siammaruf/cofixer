import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchUsers } from "~/redux/features/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PaperWrapper } from "~/components/ui/paper-wrapper";
import { Users, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import type { UserStatus } from "~/types/user";

export default function UserList() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRetry = () => {
    dispatch(fetchUsers());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="dashboard-section-title">Users</h2>
          <p className="dashboard-text-sm mt-1">Manage system users</p>
        </div>
        <Link to="/admin/users/create">
          <Button variant="gradient" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-[#A93E17]" />
              <span>User List</span>
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A7AABB]" />
              <Input
                placeholder="Search users..."
                className="pl-9 rounded-full border-[#FFFFFF0F] bg-[#060606] text-white placeholder:text-[#A7AABB]"
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
          <PaperWrapper
            loading={loading}
            loadingMessage="Loading users..."
            error={error ? new Error(error) : null}
            errorTitle="Failed to load users"
            onRetry={handleRetry}
            empty={!loading && users.length === 0}
            emptyMessage="No users found. Add your first user to get started."
            padding="none"
          >
            <div className="rounded-[20px] border border-[#FFFFFF0F] overflow-hidden">
              <div className="p-4 bg-[#0A0A0A]">
                <div className="grid grid-cols-5 font-medium text-sm text-[#A7AABB]">
                  <div className="text-base">Name</div>
                  <div className="text-base">Role</div>
                  <div className="text-base">Email</div>
                  <div className="text-base">Phone</div>
                  <div className="text-base">Status</div>
                </div>
              </div>
              <div className="divide-y divide-[#FFFFFF0F]">
                {currentItems.length > 0 ? (
                  currentItems.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-[#FFFFFF08] transition-colors">
                      <div className="grid grid-cols-5 text-sm">
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-[#A7AABB]">{user.position ?? "-"}</div>
                        <div className="text-[#A7AABB]">{user.email}</div>
                        <div className="text-[#A7AABB]">{user.phone ?? "-"}</div>
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(user.status)}`}
                          >
                            {user.status ?? "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-[#A7AABB]">
                    No users found matching your search.
                  </div>
                )}
              </div>
            </div>

            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-[#A7AABB]">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="rounded-full border-[#FFFFFF0F] text-white hover:bg-[#FFFFFF0F]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm text-[#A7AABB]">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="rounded-full border-[#FFFFFF0F] text-white hover:bg-[#FFFFFF0F]"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </PaperWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusColor(status?: UserStatus) {
  switch (status) {
    case "Active":
      return "bg-[#A93E17]/10 text-[#A93E17]";
    case "Inactive":
      return "bg-[rgb(230,87,87)]/10 text-[rgb(230,87,87)]";
    case "Suspended":
      return "bg-[#15399A]/10 text-[#15399A]";
    default:
      return "bg-[#FFFFFF0F] text-[#A7AABB]";
  }
}
