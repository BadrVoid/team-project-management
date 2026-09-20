import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useUpdateTeamMemberRole } from "@/hooks/useTeamMembers";
import type { TeamMemberResponse, TeamMemberRole } from "@/api/types";

interface UpdateTeamMemberRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  member: TeamMemberResponse;
}

export function UpdateTeamMemberRoleDialog({
  open,
  onOpenChange,
  teamId,
  member,
}: UpdateTeamMemberRoleDialogProps) {
  const [role, setRole] = useState<TeamMemberRole>(member.role);

  const mutation = useUpdateTeamMemberRole(teamId);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(member.role);
      mutation.reset();
    }
  }, [open, member.role, mutation]);

  useEffect(() => {
    if (mutation.isSuccess) {
      onOpenChange(false);
    }
  }, [mutation.isSuccess, onOpenChange]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate({
      userId: member.userId,
      data: {
        userId: member.userId,
        role,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md  bg-background">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>

          <DialogDescription>
            Change the role of this team member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="team-member-role">Role</Label>

            <select
              id="team-member-role"
              value={role}
              onChange={(event) =>
                setRole(event.target.value as TeamMemberRole)
              }
              disabled={mutation.isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="LEADER">LEADER</option>
            </select>
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">
              Failed to update member role. Please try again.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
