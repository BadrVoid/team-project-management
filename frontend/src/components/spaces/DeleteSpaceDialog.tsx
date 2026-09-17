import { Loader2, Trash2, AlertTriangle } from "lucide-react";

import type { SpaceResponse } from "@/api/types";
import { useDeleteSpace } from "@/hooks/useSpaces";

interface DeleteSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  space: SpaceResponse | null;
}

export function DeleteSpaceDialog({
  open,
  onOpenChange,
  space,
}: DeleteSpaceDialogProps) {
  const deleteSpaceMutation = useDeleteSpace();

  if (!open || !space) return null;

  const handleDelete = async () => {
    try {
      await deleteSpaceMutation.mutateAsync(space.id);

      onOpenChange(false);
    } catch {
      // Error is handled by the mutation state.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Delete Space
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {space.name}
                </span>
                ?
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {deleteSpaceMutation.isError && (
            <p className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to delete space. Please try again.
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={deleteSpaceMutation.isPending}
              className="rounded-xl px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteSpaceMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteSpaceMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}

              Delete Space
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}