// src/api/tasks.api.ts

import { api } from "../axios";
import { endpoints } from "../endpoints";
import type {
  GlobalResponse,
  TaskResponse,
} from "../types";

export async function getMyTasks(): Promise<TaskResponse[]> {
  const response = await api.get<GlobalResponse<TaskResponse[]>>(
    endpoints.tasks.my,
  );

  return response.data.data;
}

export async function getTasksByTeam(
  teamId: string,
): Promise<TaskResponse[]> {
  const response = await api.get<GlobalResponse<TaskResponse[]>>(
    endpoints.tasks.byTeam(teamId),
  );

  return response.data.data;
}