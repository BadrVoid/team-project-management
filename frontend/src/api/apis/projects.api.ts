// src/api/projects.api.ts

import { api } from "../axios";
import { endpoints } from "../endpoints";
import type {
  GlobalResponse,
  ProjectResponse,
} from "../types";

export async function getProjectsBySpace(
  spaceId: string,
): Promise<ProjectResponse[]> {
  const response = await api.get<GlobalResponse<ProjectResponse[]>>(
    endpoints.projects.bySpace(spaceId),
  );

  return response.data.data;
}