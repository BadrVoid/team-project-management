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

import { useCreateTeam } from "@/hooks/useTeams";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function CreateTeamDialog({
  open,
  onOpenChange,
  projectId,
}: CreateTeamDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createTeamMutation = useCreateTeam();

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      createTeamMutation.reset();
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    createTeamMutation.mutate({
      projectId,
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  useEffect(() => {
    if (createTeamMutation.isSuccess) {
      onOpenChange(false);
    }
  }, [createTeamMutation.isSuccess, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a team inside this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team name</Label>

            <Input
              id="team-name"
              placeholder="e.g. Frontend Team"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              disabled={createTeamMutation.isPending}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-description">
              Description
              <span className="ml-1 text-muted-foreground">(optional)</span>
            </Label>

            <Textarea
              id="team-description"
              placeholder="What will this team work on?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={4}
              disabled={createTeamMutation.isPending}
            />
          </div>

          {createTeamMutation.isError && (
            <p className="text-sm text-destructive">
              Failed to create team. Please try again.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTeamMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || createTeamMutation.isPending}
            >
              {createTeamMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
