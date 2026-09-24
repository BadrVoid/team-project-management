import { useState, type FormEvent } from "react";

import { Loader2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateTask } from "@/hooks/useTasks";

import type { TaskPriority, TeamMemberResponse } from "@/api/types";

interface CreateTaskDialogProps {
  teamId: string;
  members: TeamMemberResponse[];
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  return (
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    axiosError?.message ||
    "Failed to create task. Please try again."
  );
}

export default function CreateTaskDialog({
  teamId,
  members,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assignedToId, setAssignedToId] = useState("unassigned");

  const createTaskMutation = useCreateTask();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    setAssignedToId("unassigned");
    createTaskMutation.reset();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (createTaskMutation.isPending) {
      return;
    }

    if (!nextOpen) {
      resetForm();
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        teamId,
        title: trimmedTitle,
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || null,
        assignedTo: assignedToId === "unassigned" ? null : assignedToId,
      });

      resetForm();
      setOpen(false);
    } catch {
      // Error is displayed below.
    }
  };

  const acceptedMembers = members.filter(
    (member) => member.status === "ACCEPTED",
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>

          <DialogDescription>
            Create a task and optionally assign it to a team member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="task-title" className="text-sm font-medium">
              Title
            </label>

            <Input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Implement authentication"
              maxLength={150}
              disabled={createTaskMutation.isPending}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="task-description" className="text-sm font-medium">
              Description
            </label>

            <Textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what needs to be done..."
              rows={4}
              maxLength={5000}
              disabled={createTaskMutation.isPending}
            />
          </div>

          {/* Priority + Due Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="task-priority" className="text-sm font-medium">
                Priority
              </label>

              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TaskPriority)}
                disabled={createTaskMutation.isPending}
              >
                <SelectTrigger id="task-priority">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="task-due-date" className="text-sm font-medium">
                Due date
              </label>

              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={createTaskMutation.isPending}
              />
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-2">
            <label htmlFor="task-assignee" className="text-sm font-medium">
              Assign to
            </label>

            <Select
              value={assignedToId}
              onValueChange={(value) => setAssignedToId(value ?? "unassigned")}
              disabled={createTaskMutation.isPending}
            >
              <SelectTrigger id="task-assignee">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>

                {acceptedMembers.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error */}
          {createTaskMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {getErrorMessage(createTaskMutation.error)}
            </p>
          )}

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createTaskMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!title.trim() || createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
