
import { api } from "../axios";
import { endpoints } from "../endpoints";
import type {
  GlobalResponse,
  ProjectMemberRequest,
  ProjectMemberResponse,
} from "../types";

export const projectMembersApi = {
  async getProjectMembers(
    projectId: string,
  ): Promise<ProjectMemberResponse[]> {
    const response = await api.get<
      GlobalResponse<ProjectMemberResponse[]>
    >(endpoints.projects.members(projectId));

    return response.data.data;
  },

  async inviteMember(
    projectId: string,
    data: ProjectMemberRequest,
  ): Promise<ProjectMemberResponse> {
    const response = await api.post<
      GlobalResponse<ProjectMemberResponse>
    >(
      endpoints.projects.inviteMember(projectId),
      data,
    );

    return response.data.data;
  },

  async removeMember(
    projectId: string,
    userId: string,
  ): Promise<void> {
    await api.delete(
      endpoints.projects.removeMember(projectId, userId),
    );
  },

  async updateMemberRole(
    projectId: string,
    userId: string,
    data: ProjectMemberRequest,
  ): Promise<ProjectMemberResponse> {
    const response = await api.patch<
      GlobalResponse<ProjectMemberResponse>
    >(
      endpoints.projects.updateMemberRole(projectId, userId),
      data,
    );

    return response.data.data;
  },
};
