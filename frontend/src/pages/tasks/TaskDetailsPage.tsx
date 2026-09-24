import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit,
  MessageSquare,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getUserIdFromToken } from "@/utils/jwt";
import { canDeleteTask, canEditTask } from "@/utils/permissions";
import {
  useDeleteTask,
  useTaskDetails,
  useUpdateTaskStatus,
} from "@/hooks/useTasks";
import { useTeamMembers } from "@/hooks/useTeamMembers";

import EditTaskDialog from "@/components/tasks/EditTaskDialog";
import TaskComments from "@/components/tasks/TaskComments";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const updateTaskStatusMutation = useUpdateTaskStatus();
  const { accessToken } = useAuth();

  const { data: task, isLoading, isError } = useTaskDetails(id ?? "");

  const { data: members = [] } = useTeamMembers(task?.teamId ?? "");

  const deleteTaskMutation = useDeleteTask();

  const currentUserId = getUserIdFromToken(accessToken);

  const currentUserMembership = members.find(
    (member) => member.userId === currentUserId && member.status === "ACCEPTED",
  );
  const isCompleted = task?.status === "COMPLETED";
  const isTeamLeader = currentUserMembership?.role === "LEADER";
  const handleComplete = async () => {
    if (!task || isCompleted) {
      return;
    }

    await updateTaskStatusMutation.mutateAsync({
      taskId: task.id,
      status: "COMPLETED",
    });
  };
  const canEdit =
    !!task &&
    canEditTask(
      {
        ...task,
        assignedTo: task.assignedTo?.id ?? null,
        createdBy: task.createdBy.id,
      },
      currentUserId,
      isTeamLeader,
    );

  const canDelete =
    !!task &&
    canDeleteTask(
      {
        ...task,
        assignedTo: task.assignedTo?.id ?? null,
        createdBy: task.createdBy.id,
      },
      currentUserId,
      isTeamLeader,
    );

  const acceptedMembers = members.filter(
    (member) => member.status === "ACCEPTED",
  );

  const isAssignedUser =
    !!task?.assignedTo && task.assignedTo.id === currentUserId;

  const handleDelete = async () => {
    if (!task) {
      return;
    }

    await deleteTaskMutation.mutateAsync(task.id);

    navigate(`/teams/${task.teamId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Unable to load this task.</p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate(`/teams/${task.teamId}`)}
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Team
        </button>

        <div className="flex items-center gap-2">
          {canEdit && (
            <EditTaskDialog
              task={task}
              members={acceptedMembers}
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
            />
          )}

          {canEdit && (
            <button
              type="button"
              onClick={() => setIsEditDialogOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteTaskMutation.isPending}
              className="flex items-center gap-2 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          {!isCompleted && isAssignedUser && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={updateTaskStatusMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />

              <span className="hidden sm:inline">
                {updateTaskStatusMutation.isPending
                  ? "Completing..."
                  : "Mark as Complete"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main task card */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        {/* Task header */}
        <div className="border-b border-border p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {isCompleted ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Clock3 className="h-3.5 w-3.5" />
              )}

              {task.status.replace("_", " ")}
            </span>

            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
              {task.priority}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {task.title}
          </h1>

          <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-7 text-muted-foreground">
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4" />
              Assigned To
            </div>

            <p className="mt-2 font-semibold">
              {task.assignedTo
                ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                : "Unassigned"}
            </p>

            {isAssignedUser && (
              <span className="mt-1 block text-xs text-primary">
                Assigned to you
              </span>
            )}
          </div>

          <div className="bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Created By
            </div>

            <p className="mt-2 font-semibold">
              {task.createdBy.firstName} {task.createdBy.lastName}
            </p>
          </div>

          <div className="bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Due Date
            </div>

            <p className="mt-2 font-semibold">
              {task.dueDate || "No due date"}
            </p>
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="rounded-3xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">Task Updates</h2>

              <p className="text-sm text-muted-foreground">
                Share progress, blockers, or notes about this task.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <TaskComments
            taskId={task.id}
            currentUserId={currentUserId}
            isAssignedUser={isAssignedUser}
          />
        </div>
      </section>
    </div>
  );
}
