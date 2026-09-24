
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTeam,
  deleteTeam,
  getTeamById,
  getTeamsByProject,
  updateTeam, acceptTeamInvitation,
  rejectTeamInvitation,
} from "@/api/apis/teams.api";

export function useTeamsByProject(projectId: string) {
  return useQuery({
    queryKey: ["teams", "project", projectId],
    queryFn: () => getTeamsByProject(projectId),
    enabled: !!projectId,
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: () => getTeamById(id),
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", "project", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "details"],
      });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      projectId: string;
      data: Parameters<typeof updateTeam>[1];
    }) => updateTeam(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", "project", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "details"],
      });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
      projectId: string;
    }) => deleteTeam(id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", "project", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "details"],
      });

      queryClient.removeQueries({
        queryKey: ["teams", variables.id],
      });
    },
  });
}
export function useAcceptTeamInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      userId,
    }: {
      teamId: string;
      userId: string;
    }) => acceptTeamInvitation(teamId, userId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications", "count"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId, "members"],
      });
    },
  });
}

export function useRejectTeamInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      userId,
    }: {
      teamId: string;
      userId: string;
    }) => rejectTeamInvitation(teamId, userId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications", "count"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId, "members"],
      });
    },
  });
}