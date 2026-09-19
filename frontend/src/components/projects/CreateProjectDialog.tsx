import { useState } from "react";
import { CalendarDays, Check, Globe2, Lock, Loader2 } from "lucide-react";

import { useCreateProject } from "@/hooks/useProjects";
import type { CreateProjectRequest } from "@/api/apis/projects.api";

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

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
}

type ProjectVisibility = CreateProjectRequest["visibility"];

export function CreateProjectDialog({
  open,
  onOpenChange,
  spaceId,
}: CreateProjectDialogProps) {
  const createProjectMutation = useCreateProject();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ProjectVisibility>("PRIVATE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setVisibility("PRIVATE");
    setStartDate("");
    setEndDate("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) return;

    try {
      await createProjectMutation.mutateAsync({
        spaceId,
        name: name.trim(),
        description: description.trim(),
        visibility,
        startDate: startDate || null,
        endDate: endDate || null,
      });

      resetForm();
      onOpenChange(false);
    } catch {
      // Mutation error is displayed below.
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      resetForm();
      createProjectMutation.reset();
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>

          <DialogDescription>
            Create a new project inside this space.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>

            <Input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Graduation Project"
              maxLength={100}
              autoFocus
            />

            <p className="text-right text-xs text-muted-foreground">
              {name.length}/100
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>

            <Textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what this project is about..."
              maxLength={500}
              rows={4}
              className="resize-none"
            />

            <p className="text-right text-xs text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility("PRIVATE")}
                className={`group space-y-2 rounded-xl border p-4 text-left transition ${
                  visibility === "PRIVATE"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Lock
                    className={`size-5 ${
                      visibility === "PRIVATE"
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />

                  {visibility === "PRIVATE" && (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-sm font-medium">Private</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Only authorized members can access this project.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("PUBLIC")}
                className={`group space-y-2 rounded-xl border p-4 text-left transition ${
                  visibility === "PUBLIC"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Globe2
                    className={`size-5 ${
                      visibility === "PUBLIC"
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />

                  {visibility === "PUBLIC" && (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-sm font-medium">Public</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Other users can discover this project.
                </p>
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="project-start-date">Start date</Label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="project-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-end-date">End date</Label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="project-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {createProjectMutation.isError && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to create project. Please try again.
            </p>
          )}

          {/* Actions */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={createProjectMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || createProjectMutation.isPending}
            >
              {createProjectMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
