import { api } from "@/api/axios";
import type {
  GlobalResponse,
  TaskDetailsResponse,
  TaskPriority,
  TaskResponse,
  TaskStatus,
} from "@/api/types";

export interface CreateTaskRequest {
  teamId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  assignedTo?: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assignedTo?: string | null;
}

export const getTasksByTeam = async (
  teamId: string,
): Promise<TaskResponse[]> => {
  const response = await api.get<GlobalResponse<TaskResponse[]>>(
    `/tasks/team/${teamId}`,
  );

  return response.data.data;
};

export const getMyTasks = async (): Promise<TaskResponse[]> => {
  const response = await api.get<GlobalResponse<TaskResponse[]>>(
    "/tasks/my",
  );

  return response.data.data;
};

export const getTaskById = async (
  taskId: string,
): Promise<TaskDetailsResponse> => {
  const response = await api.get<GlobalResponse<TaskDetailsResponse>>(
    `/tasks/${taskId}`,
  );

  return response.data.data;
};

export const createTask = async (
  data: CreateTaskRequest,
): Promise<TaskResponse> => {
  const response = await api.post<GlobalResponse<TaskResponse>>(
    "/tasks",
    data,
  );

  return response.data.data;
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskRequest,
): Promise<TaskResponse> => {
  const response = await api.put<GlobalResponse<TaskResponse>>(
    `/tasks/${taskId}`,
    data,
  );

  return response.data.data;
};

export const deleteTask = async (
  taskId: string,
): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};