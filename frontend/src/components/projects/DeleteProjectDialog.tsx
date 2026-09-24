import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

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

import type { ProjectResponse } from "@/api/types";
import { useDeleteProject } from "@/hooks/useProjects";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectResponse | null;
  onDeleted: () => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!error) return fallback;

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const response = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };

    return (
      response.response?.data?.message ??
      response.response?.data?.error ??
      response.message ??
      fallback
    );
  }

  return fallback;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  onDeleted,
}: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject();

  const isPending = deleteProject.isPending;

  const handleOpenChange = (value: boolean) => {
    if (isPending) return;

    onOpenChange(value);

    if (!value) {
      deleteProject.reset();
    }
  };

  const handleDelete = () => {
    if (!project || isPending) return;

    deleteProject.mutate(
      {
        id: project.id,
        spaceId: project.spaceId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          deleteProject.reset();

          // Parent page handles navigation.
          onDeleted();
        },
      },
    );
  };

  const errorMessage = getErrorMessage(
    deleteProject.error,
    "We couldn't delete this project. Please try again.",
  );

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-border bg-background sm:max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <AlertDialogTitle className="text-xl">
              Delete project?
            </AlertDialogTitle>

            <AlertDialogDescription className="leading-6">
              This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                {project?.name}
              </span>{" "}
              and its associated data. This action cannot be undone.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {deleteProject.isError && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3"
          >
            <p className="text-sm font-medium text-destructive">
              {errorMessage}
            </p>
          </div>
        )}

        <AlertDialogFooter className="mt-2 gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isPending} className="mt-0 rounded-xl">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={isPending || !project}
            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
