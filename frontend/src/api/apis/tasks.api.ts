import { api } from "@/api/axios";
import type {
  GlobalResponse,
  TaskDetailsResponse,
  TaskPriority,
  TaskResponse,
  TaskStatus,
} from "@/api/types";
import { endpoints } from "../endpoints";

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

export async function getTasksByTeam(
  teamId: string,
): Promise<TaskResponse[]> {
  const response = await api.get<GlobalResponse<TaskResponse[]>>(
    `/tasks/team/${teamId}`,
  );

  return response.data.data;
}

export async function getMyTasks(): Promise<TaskResponse[]> {
  const response = await api.get<GlobalResponse<TaskResponse[]>>(
    "/tasks/my",
  );

  return response.data.data;
}

export async function getTaskById(
  taskId: string,
): Promise<TaskResponse> {
  const response = await api.get<GlobalResponse<TaskResponse>>(
    `/tasks/${taskId}`,
  );

  return response.data.data;
}

export async function getTaskDetails(
  taskId: string,
): Promise<TaskDetailsResponse> {
  const response = await api.get<GlobalResponse<TaskDetailsResponse>>(
    `/tasks/${taskId}/details`,
  );

  return response.data.data;
}

export async function createTask(
  data: CreateTaskRequest,
): Promise<TaskResponse> {
  const response = await api.post<GlobalResponse<TaskResponse>>(
    "/tasks",
    data,
  );

  return response.data.data;
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskRequest,
): Promise<TaskResponse> {
  const response = await api.put<GlobalResponse<TaskResponse>>(
    `/tasks/${taskId}`,
    data,
  );

  return response.data.data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<TaskResponse> {
  const response = await api.patch<GlobalResponse<TaskResponse>>(
    endpoints.tasks.status(taskId),
    null,
    {
      params: {
        status,
      },
    },
  );

  return response.data.data;
}