import { useState } from "react";
import { Loader2, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  useCreateTaskComment,
  useDeleteTaskComment,
  useTaskComments,
} from "@/hooks/useTaskComments";

interface TaskCommentsProps {
  taskId: string;
  currentUserId: string | null;
  isAssignedUser: boolean;
}

export default function TaskComments({
  taskId,
  currentUserId,
  isAssignedUser,
}: TaskCommentsProps) {
  const [content, setContent] = useState("");

  const { data: comments = [], isLoading, isError } = useTaskComments(taskId);

  const createCommentMutation = useCreateTaskComment(taskId);
  const deleteCommentMutation = useDeleteTaskComment(taskId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    await createCommentMutation.mutateAsync({
      content: trimmedContent,
    });

    setContent("");
  };

  const handleDelete = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync(commentId);
  };

  return (
    <div className="space-y-6">
      {/* Add update */}
      <div className="rounded-2xl border border-border bg-background p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={
              isAssignedUser
                ? "Write an update about what you have done..."
                : "Write a comment or update..."
            }
            rows={3}
            maxLength={2000}
            disabled={createCommentMutation.isPending}
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {content.length}/2000
            </p>

            <Button
              type="submit"
              disabled={!content.trim() || createCommentMutation.isPending}
            >
              {createCommentMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Post Update
            </Button>
          </div>
        </form>

        {createCommentMutation.isError && (
          <p className="mt-3 text-sm text-destructive">
            Failed to post update. Please try again.
          </p>
        )}
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load task updates.
          </div>
        )}

        {!isLoading && !isError && comments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="font-medium">No updates yet</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to share progress on this task.
            </p>
          </div>
        )}

        {comments.map((comment) => {
          const isOwnComment = comment.user.id === currentUserId;

          return (
            <article
              key={comment.id}
              className="rounded-2xl border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {comment.user.firstName?.charAt(0)}
                    {comment.user.lastName?.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium">
                      {comment.user.firstName} {comment.user.lastName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {isOwnComment && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleteCommentMutation.isPending}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
                {comment.content}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
