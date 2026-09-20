import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, UserPlus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useDiscoverUsers } from "@/hooks/useUsers";
import type { UserDiscoveryResponse } from "@/api/types";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;

  roleOptions: string[];
  defaultRole?: string;

  onInvite: (userId: string, role: string) => void;
  isPending?: boolean;
  isError?: boolean;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  title = "Invite Member",
  description = "Search for a user and invite them.",
  roleOptions,
  defaultRole,
  onInvite,
  isPending = false,
  isError = false,
}: InviteMemberDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<UserDiscoveryResponse | null>(null);

  const [role, setRole] = useState(defaultRole ?? roleOptions[0] ?? "");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading } = useDiscoverUsers({
    keyword: debouncedSearch || undefined,
    page: 0,
    size: 10,
  });

  const users = useMemo(() => data?.content ?? [], [data]);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch("");
      setDebouncedSearch("");
      setSelectedUser(null);
      setRole(defaultRole ?? roleOptions[0] ?? "");
    }
  }, [open, defaultRole, roleOptions]);

  const handleInvite = () => {
    if (!selectedUser || !role) {
      return;
    }

    onInvite(selectedUser.id, role);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Selected user */}
          {selectedUser && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {selectedUser.firstName.charAt(0)}
                  {selectedUser.lastName.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>

                  {selectedUser.bio && (
                    <p className="truncate text-xs text-muted-foreground">
                      {selectedUser.bio}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Search */}
          {!selectedUser && (
            <div className="space-y-2">
              <Label htmlFor="member-search">Search user</Label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="member-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email, skill or tag..."
                  className="pl-9"
                  disabled={isPending}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {!selectedUser && debouncedSearch && (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium">No users found</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Try another search.
                  </p>
                </div>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>

                      {user.bio && (
                        <p className="truncate text-xs text-muted-foreground">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Role */}
          {selectedUser && roleOptions.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="member-role">Role</Label>

              <select
                id="member-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isError && (
            <p className="text-sm text-destructive">
              Failed to invite member. Please try again.
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleInvite}
              disabled={!selectedUser || !role || isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
