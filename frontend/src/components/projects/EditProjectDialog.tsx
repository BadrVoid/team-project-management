import { useEffect } from "react";

import { useForm } from "react-hook-form";

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

import type { ProjectResponse, UpdateProjectRequest } from "@/api/types";

import { useUpdateProject } from "@/hooks/useProjects";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectResponse | null;
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
}: EditProjectDialogProps) {
  const updateProject = useUpdateProject();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateProjectRequest>({
    defaultValues: {
      name: "",
      description: "",
      status: "PLANNING",
      startDate: null,
      endDate: null,
    },
  });

  const startDate = watch("startDate");

  useEffect(() => {
    if (project && open) {
      reset({
        name: project.name,
        description: project.description ?? "",
        status: project.status,
        startDate: project.startDate ?? null,
        endDate: project.endDate ?? null,
      });
    }
  }, [project, open, reset]);

  const onSubmit = (data: UpdateProjectRequest) => {
    if (!project) return;

    updateProject.mutate(
      {
        id: project.id,
        data: {
          name: data.name.trim(),
          description: data.description?.trim() ?? "",
          status: data.status,
          startDate: data.startDate || null,
          endDate: data.endDate || null,
        },
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
      updateProject.reset();
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>

          <DialogDescription>
            Update the project's information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="edit-project-name" className="text-sm font-medium">
              Project Name
            </label>

            <Input
              id="edit-project-name"
              placeholder="Project name"
              {...register("name", {
                required: "Project name is required",
                minLength: {
                  value: 2,
                  message: "Project name must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Project name cannot exceed 100 characters",
                },
              })}
            />

            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="edit-project-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="edit-project-description"
              placeholder="Project description"
              rows={4}
              className="resize-none"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters",
                },
              })}
            />

            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label
              htmlFor="edit-project-status"
              className="text-sm font-medium"
            >
              Status
            </label>

            <select
              id="edit-project-status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              {...register("status")}
            >
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="edit-project-start-date"
                className="text-sm font-medium"
              >
                Start Date
              </label>

              <Input
                id="edit-project-start-date"
                type="date"
                {...register("startDate")}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-project-end-date"
                className="text-sm font-medium"
              >
                End Date
              </label>

              <Input
                id="edit-project-end-date"
                type="date"
                min={startDate || undefined}
                {...register("endDate")}
              />
            </div>
          </div>

          {/* Error */}
          {updateProject.isError && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to update project. Please try again.
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateProject.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={updateProject.isPending}>
              {updateProject.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
