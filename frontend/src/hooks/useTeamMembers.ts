
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { teamMembersApi } from "@/api/apis/team-members.api";

import type {
  TeamMemberRequest,
} from "@/api/types";

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ["teams", teamId, "members"],

    queryFn: () =>
      teamMembersApi.getTeamMembers(teamId),

    enabled: !!teamId,
  });
}

export function useAddTeamMember(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamMemberRequest) =>
      teamMembersApi.addMember(teamId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", teamId],
      });
    },
  });
}

export function useUpdateTeamMemberRole(
  teamId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: TeamMemberRequest;
    }) =>
      teamMembersApi.updateMemberRole(
        teamId,
        userId,
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", teamId],
      });
    },
  });
}

export function useRemoveTeamMember(
  teamId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      teamMembersApi.removeMember(
        teamId,
        userId,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", teamId],
      });
    },
  });
}
