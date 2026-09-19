import { useState } from "react";
import { Globe2, Lock, Loader2, Check } from "lucide-react";

import { useCreateSpace } from "@/hooks/useSpaces";
import type { SpaceVisibility } from "@/api/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const [visibility, setVisibility] = useState<SpaceVisibility>("PRIVATE");

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
      // Handled by mutation state
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      resetForm();
      createSpaceMutation.reset();
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background">
        <DialogHeader>
          <DialogTitle>Create Space</DialogTitle>
          <DialogDescription>
            Create a new workspace for your projects.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="space-name">Space name</Label>
            <Input
              id="space-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Graduation Project"
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="space-description">Description</Label>
            <Textarea
              id="space-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this space is for..."
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <p className="text-right text-xs text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility("PRIVATE")}
                className={`group relative rounded-xl border p-4 text-left transition space-y-2 ${
                  visibility === "PRIVATE"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Lock
                    className={`size-5 transition-colors ${
                      visibility === "PRIVATE"
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {visibility === "PRIVATE" && (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50 duration-150">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium">Private</p>
                <p className="text-xs text-muted-foreground">
                  Only you can access this space.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("PUBLIC")}
                className={`group relative rounded-xl border p-4 text-left transition space-y-2 ${
                  visibility === "PUBLIC"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Globe2
                    className={`size-5 transition-colors ${
                      visibility === "PUBLIC"
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {visibility === "PUBLIC" && (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50 duration-150">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium">Public</p>
                <p className="text-xs text-muted-foreground">
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

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={createSpaceMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createSpaceMutation.isPending}
            >
              {createSpaceMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Create Space
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
