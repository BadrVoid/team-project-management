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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateTeam } from "@/hooks/useTeams";
import type { TeamResponse } from "@/api/types";

interface EditTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamResponse;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  return (
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    axiosError?.message ||
    "Failed to update team. Please try again."
  );
}

export function EditTeamDialog({
  open,
  onOpenChange,
  team,
}: EditTeamDialogProps) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description ?? "");

  const updateTeamMutation = useUpdateTeam();

  useEffect(() => {
    if (!open) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(team.name);
    setDescription(team.description ?? "");
    updateTeamMutation.reset();
  }, [open, team.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    updateTeamMutation.mutate(
      {
        id: team.id,
        projectId: team.projectId,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (updateTeamMutation.isPending) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>

          <DialogDescription>
            Update the team's name and description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-team-name">Team name</Label>

            <Input
              id="edit-team-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              disabled={updateTeamMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-team-description">Description</Label>

            <Textarea
              id="edit-team-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={4}
              disabled={updateTeamMutation.isPending}
            />
          </div>

          {updateTeamMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {getErrorMessage(updateTeamMutation.error)}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateTeamMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || updateTeamMutation.isPending}
            >
              {updateTeamMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
