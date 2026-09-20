
import { api } from "../axios";
import { endpoints } from "../endpoints";

import type {
  GlobalResponse,
  TeamMemberRequest,
  TeamMemberResponse,
} from "../types";

export const teamMembersApi = {
  async getTeamMembers(
    teamId: string,
  ): Promise<TeamMemberResponse[]> {
    const response = await api.get<
      GlobalResponse<TeamMemberResponse[]>
    >(endpoints.teams.members(teamId));

    return response.data.data;
  },

  async addMember(
    teamId: string,
    data: TeamMemberRequest,
  ): Promise<TeamMemberResponse> {
    const response = await api.post<
      GlobalResponse<TeamMemberResponse>
    >(
      endpoints.teams.addMember(teamId),
      data,
    );

    return response.data.data;
  },

  async updateMemberRole(
    teamId: string,
    userId: string,
    data: TeamMemberRequest,
  ): Promise<TeamMemberResponse> {
    const response = await api.put<
      GlobalResponse<TeamMemberResponse>
    >(
      endpoints.teams.updateMemberRole(teamId, userId),
      data,
    );

    return response.data.data;
  },

  async removeMember(
    teamId: string,
    userId: string,
  ): Promise<void> {
    await api.delete(
      endpoints.teams.removeMember(teamId, userId),
    );
  },
};

