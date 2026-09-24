import { api } from "@/api/axios";
import type {
  CreateTaskCommentRequest,
  GlobalResponse,
  TaskCommentResponse,
} from "@/api/types";

export const getTaskComments = async (
  taskId: string,
): Promise<TaskCommentResponse[]> => {
  const response = await api.get<
    GlobalResponse<TaskCommentResponse[]>
  >(`/tasks/${taskId}/comments`);

  return response.data.data;
};

export const createTaskComment = async (
  taskId: string,
  data: CreateTaskCommentRequest,
): Promise<TaskCommentResponse> => {
  const response = await api.post<
    GlobalResponse<TaskCommentResponse>
  >(`/tasks/${taskId}/comments`, data);

  return response.data.data;
};

export const deleteTaskComment = async (
  taskId: string,
  commentId: string,
): Promise<void> => {
  await api.delete(`/tasks/${taskId}/comments/${commentId}`);
};