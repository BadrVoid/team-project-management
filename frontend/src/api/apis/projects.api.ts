
import { api } from "../axios";
import { endpoints } from "../endpoints";

import type {
  GlobalResponse,
  ProjectDetailsResponse,
  ProjectResponse,
  UpdateProjectRequest,
  ProjectMemberRequest,
  ProjectMemberResponse,
} from "../types";

// =========================
// Projects
// =========================

export interface CreateProjectRequest {
  spaceId: string;
  name: string;
  description?: string;
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
  const response = await api.get<
    GlobalResponse<ProjectDetailsResponse>
  >(endpoints.projects.details(id));

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

export async function deleteProject(
  id: string,
): Promise<void> {
  await api.delete(endpoints.projects.byId(id));
}

// =========================
// Project Invitations
// =========================

export async function acceptProjectInvitation(
  projectId: string,
  userId: string,
): Promise<void> {
  await api.patch(
    endpoints.projects.acceptInvitation(projectId, userId),
  );
}

export async function rejectProjectInvitation(
  projectId: string,
  userId: string,
): Promise<void> {
  await api.patch(
    endpoints.projects.rejectInvitation(projectId, userId),
  );
}

// =========================
// Project Members
// =========================

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
