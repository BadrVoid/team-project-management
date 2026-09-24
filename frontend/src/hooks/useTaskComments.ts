import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTaskComment,
  deleteTaskComment,
  getTaskComments,
} from "@/api/apis/task-comments.api";

import type { CreateTaskCommentRequest } from "@/api/types";

export const useTaskComments = (taskId: string) => {
  return useQuery({
    queryKey: ["task-comments", taskId],
    queryFn: () => getTaskComments(taskId),
    enabled: !!taskId,
  });
};

export const useCreateTaskComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskCommentRequest) =>
      createTaskComment(taskId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-comments", taskId],
      });
    },
  });
};

export const useDeleteTaskComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      deleteTaskComment(taskId, commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-comments", taskId],
      });
    },
  });
};