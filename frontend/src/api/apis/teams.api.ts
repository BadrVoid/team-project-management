// src/api/teams.api.ts

import { api } from "../axios";
import { endpoints } from "../endpoints";
import type {
  GlobalResponse,
  TeamSummaryResponse,
} from "../types";

export async function getTeamsByProject(
  projectId: string,
): Promise<TeamSummaryResponse[]> {
  const response = await api.get<GlobalResponse<TeamSummaryResponse[]>>(
    endpoints.teams.byProject(projectId),
  );

  return response.data.data;
}