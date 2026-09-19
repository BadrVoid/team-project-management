import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Search, UserPlus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDiscoverUsers } from "@/hooks/users.hooks";
import { useInviteMember } from "@/hooks/project-members.hooks";
import type { ProjectMemberRole, UserDiscoveryResponse } from "@/api/types";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  projectId,
}: InviteMemberDialogProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<UserDiscoveryResponse | null>(null);
  const [role, setRole] = useState<ProjectMemberRole>("MEMBER");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inviteMember = useInviteMember(projectId);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = search.trim();
      setDebouncedSearch(trimmed);
      setIsDropdownOpen(trimmed.length > 0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    data,
    isLoading: isSearching,
    isError: isSearchError,
  } = useDiscoverUsers(
    {
      keyword: debouncedSearch || undefined,
      page: 0,
      size: 10,
    },
    { enabled: Boolean(debouncedSearch) },
  );

  const users = data?.content ?? [];

  const handleSelectUser = (user: UserDiscoveryResponse) => {
    setSelectedUser(user);
    setSearch("");
    setDebouncedSearch("");
    setIsDropdownOpen(false);
  };

  const handleRemoveUser = () => {
    setSelectedUser(null);
  };

  const resetForm = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedUser(null);
    setRole("MEMBER");
    setIsDropdownOpen(false);
    inviteMember.reset();
  };

  const handleOpenChange = (value: boolean) => {
    if (inviteMember.isPending) return;
    if (!value) resetForm();
    onOpenChange(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;

    inviteMember.mutate(
      { userId: selectedUser.id, role },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-background sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <UserPlus className="size-5 text-primary" />
          </div>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Search users by name, skills, or tags.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user-search">User</Label>

            {selectedUser ? (
              <SelectedUser user={selectedUser} onRemove={handleRemoveUser} />
            ) : (
              <div className="relative" ref={searchRef}>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="user-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => search.trim() && setIsDropdownOpen(true)}
                  placeholder="Search by name, skill, or tag..."
                  disabled={inviteMember.isPending}
                  className="pl-9"
                  aria-expanded={isDropdownOpen}
                  aria-autocomplete="list"
                />

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                    {isSearching ? (
                      <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Searching...
                      </div>
                    ) : isSearchError ? (
                      <div className="p-4 text-center text-sm text-destructive">
                        Failed to search users.
                      </div>
                    ) : users.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No users found.
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto p-1">
                        {users.map((user) => (
                          <UserSearchResult
                            key={user.id}
                            user={user}
                            onSelect={handleSelectUser}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!selectedUser && (
              <p className="text-xs text-muted-foreground">
                Try a name, skill, or tag such as "Java", "React", or "backend".
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role-select">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as ProjectMemberRole)}
              disabled={inviteMember.isPending}
            >
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {inviteMember.isError && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to invite this user. Please try again.
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={inviteMember.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedUser || inviteMember.isPending}
              className="gap-2"
            >
              {inviteMember.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Invite Member
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SelectedUser({
  user,
  onRemove,
}: {
  user: UserDiscoveryResponse;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
      <div className="flex items-start gap-3">
        <UserAvatar user={user} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove selected user"
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <UserSkillsAndTags user={user} />
        </div>
      </div>
    </div>
  );
}

function UserSearchResult({
  user,
  onSelect,
}: {
  user: UserDiscoveryResponse;
  onSelect: (user: UserDiscoveryResponse) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className="flex w-full gap-3 rounded-lg p-3 text-left transition hover:bg-muted"
    >
      <UserAvatar user={user} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">
            {user.firstName} {user.lastName}
          </p>
          <Check className="size-4 shrink-0 text-muted-foreground" />
        </div>
        {user.bio && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {user.bio}
          </p>
        )}
        <UserSkillsAndTags user={user} />
      </div>
    </button>
  );
}

function UserSkillsAndTags({ user }: { user: UserDiscoveryResponse }) {
  const skills = user.skills ?? [];
  const tags = user.tags ?? [];

  if (skills.length === 0 && tags.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {skills.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="mt-0.5 w-12 shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Skills
          </span>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="mt-0.5 w-12 shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Tags
          </span>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserAvatar({
  user,
  size,
}: {
  user: UserDiscoveryResponse;
  size: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "size-9" : "size-10";
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10`}
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="size-full object-cover"
        />
      ) : (
        <span className={`${textClass} font-semibold text-primary`}>
          {user.firstName?.charAt(0)}
          {user.lastName?.charAt(0)}
        </span>
      )}
    </div>
  );
}
