import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { projectMembersApi } from "@/api/apis/project-members.api";
import type { ProjectMemberRequest } from "@/api/types";

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => projectMembersApi.getProjectMembers(projectId),
    enabled: !!projectId,
  });
}

export function useInviteMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectMemberRequest) =>
      projectMembersApi.inviteMember(projectId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });
    },
  });
}

export function useRemoveMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      projectMembersApi.removeMember(projectId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });
    },
  });
}

export function useUpdateMemberRole(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: ProjectMemberRequest;
    }) =>
      projectMembersApi.updateMemberRole(
        projectId,
        userId,
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "details"],
      });
    },
  });
}
