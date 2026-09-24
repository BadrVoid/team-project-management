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
  onDeleted?: () => void;
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
    "Failed to delete team. Please try again."
  );
}

export function DeleteTeamDialog({
  open,
  onOpenChange,
  team,
  onDeleted,
}: DeleteTeamDialogProps) {
  const deleteTeamMutation = useDeleteTeam();

  const handleOpenChange = (nextOpen: boolean) => {
    if (deleteTeamMutation.isPending) {
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleDelete = () => {
    deleteTeamMutation.mutate(
      {
        id: team.id,
        projectId: team.projectId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          deleteTeamMutation.reset();
          onDeleted?.();
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Team?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{team.name}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteTeamMutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            {getErrorMessage(deleteTeamMutation.error)}
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
            {!deleteTeamMutation.isPending && (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
