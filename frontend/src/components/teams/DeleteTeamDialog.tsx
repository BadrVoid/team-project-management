import { Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteTeam } from "@/hooks/useTeams";
import type { TeamResponse } from "@/api/types";

interface DeleteTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamResponse;
}

export function DeleteTeamDialog({
  open,
  onOpenChange,
  team,
}: DeleteTeamDialogProps) {
  const deleteTeamMutation = useDeleteTeam();

  const handleDelete = () => {
    deleteTeamMutation.mutate({
      id: team.id,
      projectId: team.projectId,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent  className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Team?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{team.name}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteTeamMutation.isError && (
          <p className="text-sm text-destructive">
            Failed to delete team. Please try again.
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTeamMutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTeamMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteTeamMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
