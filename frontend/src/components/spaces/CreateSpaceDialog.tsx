import { useState } from "react";
import { Globe2, Lock, Loader2, Plus } from "lucide-react";

import { useCreateSpace } from "@/hooks/useSpaces";
import type { SpaceVisibility } from "@/api/types";

interface CreateSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSpaceDialog({
  open,
  onOpenChange,
}: CreateSpaceDialogProps) {
  const createSpaceMutation = useCreateSpace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] =
    useState<SpaceVisibility>("PRIVATE");

  const resetForm = () => {
    setName("");
    setDescription("");
    setVisibility("PRIVATE");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) return;

    try {
      await createSpaceMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        visibility,
      });

      resetForm();
      onOpenChange(false);
    } catch {
      // Error is handled by the mutation state.
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      resetForm();
      createSpaceMutation.reset();
    }

    onOpenChange(value);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Plus className="size-5 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Create Space
              </h2>
              <p className="text-sm text-muted-foreground">
                Create a new workspace for your projects.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Space name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Graduation Project"
              maxLength={100}
              autoFocus
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what this space is for..."
              maxLength={500}
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <p className="text-right text-xs text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Visibility
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility("PRIVATE")}
                className={`rounded-xl border p-4 text-left transition ${
                  visibility === "PRIVATE"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Lock className="mb-2 size-5" />

                <p className="text-sm font-medium">
                  Private
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Only you can access this space.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("PUBLIC")}
                className={`rounded-xl border p-4 text-left transition ${
                  visibility === "PUBLIC"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Globe2 className="mb-2 size-5" />

                <p className="text-sm font-medium">
                  Public
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Other users can discover this space.
                </p>
              </button>
            </div>
          </div>

          {createSpaceMutation.isError && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to create space. Please try again.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={createSpaceMutation.isPending}
              className="rounded-xl px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !name.trim() ||
                createSpaceMutation.isPending
              }
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createSpaceMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              Create Space
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}