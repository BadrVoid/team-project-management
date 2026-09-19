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

export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  onDeleted,
}: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject();

  const handleDelete = () => {
    if (!project) return;

    deleteProject.mutate(
      {
        id: project.id,
        spaceId: project.spaceId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onDeleted();
        },
      },
    );
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!deleteProject.isPending) {
          onOpenChange(value);
        }
      }}
    >
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>

          <AlertDialogTitle>Delete Project?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete "
            <strong className="font-semibold text-foreground">
              {project?.name}
            </strong>{" "}
            " ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProject.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={deleteProject.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProject.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Delete Project
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
