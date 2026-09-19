
import { api } from "../axios";
import { endpoints } from "../endpoints";
import type {
  GlobalResponse,
  TeamCreateRequest,
  TeamResponse,
  TeamUpdateRequest,
} from "../types";

export async function getTeamsByProject(
  projectId: string,
): Promise<TeamResponse[]> {
  const response = await api.get<GlobalResponse<TeamResponse[]>>(
    endpoints.teams.byProject(projectId),
  );

  return response.data.data;
}

export async function getTeamById(
  id: string,
): Promise<TeamResponse> {
  const response = await api.get<GlobalResponse<TeamResponse>>(
    endpoints.teams.byId(id),
  );

  return response.data.data;
}

export async function createTeam(
  data: TeamCreateRequest,
): Promise<TeamResponse> {
  const response = await api.post<GlobalResponse<TeamResponse>>(
    endpoints.teams.create,
    data,
  );

  return response.data.data;
}

export async function updateTeam(
  id: string,
  data: TeamUpdateRequest,
): Promise<TeamResponse> {
  const response = await api.put<GlobalResponse<TeamResponse>>(
    endpoints.teams.byId(id),
    data,
  );

  return response.data.data;
}

export async function deleteTeam(
  id: string,
): Promise<void> {
  await api.delete(endpoints.teams.byId(id));
}
