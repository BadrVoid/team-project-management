import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, CheckSquare, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getMyTasks } from "@/api/apis/tasks.api";
import type { TaskResponse } from "@/api/types";

export default function TasksView() {
  const navigate = useNavigate();

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", "my"],
    queryFn: getMyTasks,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center rounded-2xl border border-border">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <p className="text-sm font-medium">Failed to load your tasks.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <CheckSquare className="mx-auto h-10 w-10 text-muted-foreground" />

        <p className="mt-3 text-sm font-medium">No tasks yet</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Tasks assigned to you will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Tasks</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          All tasks assigned to you across your projects.
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => navigate(`/tasks/${task.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   Task Card
============================================================================ */

function TaskCard({
  task,
  onClick,
}: {
  task: TaskResponse;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border
        border-border
        bg-background
        p-5
        text-left
        shadow-sm
        transition-all
        duration-200
        hover:border-primary/30
        hover:bg-muted/20
        hover:shadow-md
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/50
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <CheckSquare className="h-4 w-4 text-primary" />
            </div>

            <h3 className="truncate font-semibold">{task.title}</h3>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={task.status} />

          <PriorityBadge priority={task.priority} />

          <ArrowRight
            className="
              ml-1
              h-4
              w-4
              text-muted-foreground
              transition-transform
              duration-200
              group-hover:translate-x-0.5
              group-hover:text-primary
            "
          />
        </div>
      </div>

      {task.dueDate && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />

          <span>Due {formatDate(task.dueDate)}</span>
        </div>
      )}
    </button>
  );
}

/* ============================================================================
   Status Badge
============================================================================ */

function StatusBadge({ status }: { status: TaskResponse["status"] }) {
  return (
    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
      {formatText(status)}
    </span>
  );
}

/* ============================================================================
   Priority Badge
============================================================================ */

function PriorityBadge({ priority }: { priority: TaskResponse["priority"] }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium">
      {formatText(priority)}
    </span>
  );
}

/* ============================================================================
   Helpers
============================================================================ */

function formatText(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
