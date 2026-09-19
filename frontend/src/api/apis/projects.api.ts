import { api } from "../axios";
import { endpoints } from "../endpoints";

import type {
  GlobalResponse,
  ProjectDetailsResponse,
  ProjectResponse, UpdateProjectRequest
} from "../types";

export interface CreateProjectRequest {
  spaceId: string;
  name: string;
  description?: string;
  visibility: "PRIVATE" | "PUBLIC";
  startDate?: string | null;
  endDate?: string | null;
}



export async function getProjectsBySpace(
  spaceId: string,
): Promise<ProjectResponse[]> {
  const response = await api.get<GlobalResponse<ProjectResponse[]>>(
    endpoints.projects.bySpace(spaceId),
  );

  return response.data.data;
}

export async function getProjectById(
  id: string,
): Promise<ProjectResponse> {
  const response = await api.get<GlobalResponse<ProjectResponse>>(
    endpoints.projects.byId(id),
  );

  return response.data.data;
}

export async function getProjectDetails(
  id: string,
): Promise<ProjectDetailsResponse> {
  const response = await api.get<GlobalResponse<ProjectDetailsResponse>>(
    endpoints.projects.details(id),
  );

  return response.data.data;
}

export async function createProject(
  data: CreateProjectRequest,
): Promise<ProjectResponse> {
  const response = await api.post<GlobalResponse<ProjectResponse>>(
    endpoints.projects.create,
    data,
  );

  return response.data.data;
}

export async function updateProject(
  id: string,
  data: UpdateProjectRequest,
): Promise<ProjectResponse> {
  const response = await api.put<GlobalResponse<ProjectResponse>>(
    endpoints.projects.byId(id),
    data,
  );

  return response.data.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(endpoints.projects.byId(id));
}