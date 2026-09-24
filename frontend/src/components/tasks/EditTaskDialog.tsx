import { useEffect, useState, type FormEvent } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateTask } from "@/hooks/useTasks";

import type {
  TaskDetailsResponse,
  TaskPriority,
  TaskStatus,
  TeamMemberResponse,
} from "@/api/types";

interface EditTaskDialogProps {
  task: TaskDetailsResponse;
  members: TeamMemberResponse[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTaskDialog({
  task,
  members,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assignedToId, setAssignedToId] = useState("unassigned");

  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    if (!open) return;

    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate ?? "");
    setAssignedToId(task.assignedTo?.id ?? "unassigned");
  }, [open, task]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        data: {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate: dueDate || null,
          assignedToId: assignedToId === "unassigned" ? null : assignedToId,
        },
      });

      onOpenChange(false);
    } catch {
      // Keep dialog open when the request fails.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>

          <DialogDescription>
            Update the task information and assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>

            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>

            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={5000}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <Select
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>

              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TaskPriority)}
              >
                <SelectTrigger>
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Due date</label>

              <Input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign to</label>

              <Select value={assignedToId} onValueChange={setAssignedToId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>

                  {members.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {updateTaskMutation.isError && (
            <p className="text-sm text-destructive">
              Failed to update task. Please try again.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateTaskMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!title.trim() || updateTaskMutation.isPending}
            >
              {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
