import { CalendarDays, Pencil, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { TaskResponse } from "@/api/types";

interface TaskCardProps {
  task: TaskResponse;
  onEdit: () => void;
  onDelete: () => void;
}

const statusLabels: Record<TaskResponse["status"], string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  COMPLETED: "Completed",
};

const priorityLabels: Record<TaskResponse["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="group rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={onEdit}
          className="min-w-0 text-left"
        >
          <h3 className="truncate font-semibold transition group-hover:text-primary">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
        </button>

        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {statusLabels[task.status]}
        </Badge>

        <Badge variant="secondary">
          {priorityLabels[task.priority]}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {task.dueDate && (
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{task.dueDate}</span>
          </div>
        )}

        {task.assignedTo && (
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>Assigned</span>
          </div>
        )}
      </div>
    </div>
  );
}