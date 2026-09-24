import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, Check, Loader2 } from "lucide-react";

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
  const isPending = updateProject.isPending;

  useEffect(() => {
    if (!project || !open) return;

    reset({
      name: project.name,
      description: project.description ?? "",
      status: project.status,
      startDate: project.startDate ?? null,
      endDate: project.endDate ?? null,
    });

    updateProject.reset();
  }, [project, open, reset]);

  const handleOpenChange = (value: boolean) => {
    if (isPending) return;

    if (!value) {
      reset();
      updateProject.reset();
    }

    onOpenChange(value);
  };

  const onSubmit = (data: UpdateProjectRequest) => {
    if (!project || isPending) return;

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
          updateProject.reset();

          // Stay on the project details page.
          onOpenChange(false);
        },
      },
    );
  };

  const errorMessage = getErrorMessage(
    updateProject.error,
    "We couldn't update this project. Please try again.",
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-background sm:max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">Edit Project</DialogTitle>

          <DialogDescription className="leading-6">
            Update the project's details, status, and timeline.
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
              placeholder="Enter project name"
              autoComplete="off"
              disabled={isPending}
              {...register("name", {
                required: "Project name is required.",
                validate: (value) =>
                  value.trim().length >= 2 ||
                  "Project name must be at least 2 characters.",
                maxLength: {
                  value: 100,
                  message: "Project name cannot exceed 100 characters.",
                },
              })}
            />

            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-project-description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <span className="text-xs text-muted-foreground">Optional</span>
            </div>

            <Textarea
              id="edit-project-description"
              placeholder="Describe what this project is about..."
              rows={4}
              disabled={isPending}
              className="resize-none"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters.",
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
              disabled={isPending}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("status")}
            >
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />

              <span className="text-sm font-medium">Project Timeline</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="edit-project-start-date"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Start Date
                </label>

                <Input
                  id="edit-project-start-date"
                  type="date"
                  disabled={isPending}
                  {...register("startDate")}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="edit-project-end-date"
                  className="text-xs font-medium text-muted-foreground"
                >
                  End Date
                </label>

                <Input
                  id="edit-project-end-date"
                  type="date"
                  min={startDate || undefined}
                  disabled={isPending}
                  {...register("endDate", {
                    validate: (value) => {
                      if (!value || !startDate) {
                        return true;
                      }

                      return (
                        value >= startDate ||
                        "End date must be on or after the start date."
                      );
                    },
                  })}
                />

                {errors.endDate && (
                  <p className="text-xs text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Real API error */}
          {updateProject.isError && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3"
            >
              <p className="text-sm font-medium text-destructive">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending || !project}
              className="rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
