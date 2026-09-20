import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleUser,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import EditTaskDialog from "@/components/tasks/EditTaskDialog";
import { useTask, useDeleteTask } from "@/hooks/useTasks";
import { useTeamMembers } from "@/hooks/useTeamMembers";

const statusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  COMPLETED: "Completed",
} as const;

const priorityLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
} as const;

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: task, isLoading, isError } = useTask(id ?? "");

  const { data: members = [] } = useTeamMembers(task?.teamId ?? "");

  const deleteTaskMutation = useDeleteTask();

  const handleDelete = async () => {
    if (!task) return;

    try {
      await deleteTaskMutation.mutateAsync(task.id);
      navigate(-1);
    } catch {
      // Keep dialog open if deletion fails.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading task...</p>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h2 className="text-lg font-semibold">Task not found</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This task may have been deleted or you may not have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main task information */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{statusLabels[task.status]}</Badge>

              <Badge variant="secondary">{priorityLabels[task.priority]}</Badge>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              {task.title}
            </h1>

            <p className="mt-3 whitespace-pre-wrap text-muted-foreground">
              {task.description || "No description provided."}
            </p>
          </div>
        </div>
      </section>

      {/* Information */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <CircleUser className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Assigned to</p>

              <p className="mt-1 font-medium">
                {task.assignedTo
                  ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                  : "Unassigned"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Due date</p>

              <p className="mt-1 font-medium">
                {task.dueDate || "No due date"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Clock3 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Status</p>

              <p className="mt-1 font-medium">{statusLabels[task.status]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Created by */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Created by</p>

            <p className="mt-1 font-medium">
              {task.createdBy.firstName} {task.createdBy.lastName}
            </p>

            <p className="text-sm text-muted-foreground">
              {task.createdBy.email}
            </p>
          </div>
        </div>
      </section>

      {/* Edit */}
      <EditTaskDialog
        task={task}
        members={members}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Delete */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{task.title}</span>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteTaskMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
