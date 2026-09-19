/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Loader2} from "lucide-react";

import type { SpaceResponse } from "@/api/types";
import { useUpdateSpace } from "@/hooks/useSpaces";

interface EditSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  space: SpaceResponse | null;
}

export function EditSpaceDialog({
  open,
  onOpenChange,
  space,
}: EditSpaceDialogProps) {
  const updateSpaceMutation = useUpdateSpace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (space) {
      setName(space.name);
      setDescription(space.description ?? "");
    }
  }, [space]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!space || !name.trim()) return;

    try {
      await updateSpaceMutation.mutateAsync({
        id: space.id,
        data: {
          name: name.trim(),
          description: description.trim(),
        },
      });

      onOpenChange(false);
    } catch {
      // Error is handled by the mutation state.
    }
  };

  if (!open || !space) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">Edit Space</h2>

              <p className="text-sm text-muted-foreground">
                Update your space information.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Space name</label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              autoFocus
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <p className="text-right text-xs text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          {updateSpaceMutation.isError && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to update space. Please try again.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={updateSpaceMutation.isPending}
              className="rounded-xl px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || updateSpaceMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateSpaceMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
