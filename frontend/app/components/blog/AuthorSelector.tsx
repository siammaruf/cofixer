import { useState, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Search, User, X } from "lucide-react";
import type { User as UserType } from "~/types/user";

interface AuthorSelectorProps {
  users: UserType[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AuthorSelector({ users, value, onChange, disabled }: AuthorSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedUser = useMemo(() => {
    if (!value) return null;
    return users.find(
      (u) =>
        u.fullName === value ||
        u.email === value ||
        `${u.firstName || ""} ${u.lastName || ""}`.trim() === value
    );
  }, [users, value]);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return users;
    return users.filter((u) => {
      const name = u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email;
      return name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    });
  }, [users, search]);

  const handleSelect = (user: UserType) => {
    const name = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
    onChange(name);
    setOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onChange("");
  };

  const displayName = selectedUser
    ? (selectedUser.fullName || `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() || selectedUser.email)
    : value || "Select author";

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between h-10 px-3"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedUser ? (
            <Avatar className="w-5 h-5">
              <AvatarImage src={selectedUser.image ?? undefined} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {getInitials(selectedUser.fullName || selectedUser.firstName)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="w-4 h-4 text-muted-foreground" />
          )}
          <span className={selectedUser || value ? "text-foreground" : "text-muted-foreground"}>
            {displayName}
          </span>
        </div>
        {(selectedUser || value) && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                handleClear();
              }
            }}
            className="ml-2 p-0.5 rounded hover:bg-muted"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              Select Author
            </DialogTitle>
          </DialogHeader>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-[34px]"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 -mx-2 px-2 space-y-1 min-h-[200px]">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => {
                const name = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
                const isSelected = name === displayName;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelect(user)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(user.fullName || user.firstName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate mb-0">{name}</p>
                      <p className="text-xs text-muted-foreground truncate mb-0">{user.email}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
