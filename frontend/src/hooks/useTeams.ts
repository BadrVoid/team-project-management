
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
  updateTeam,
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
      projectId,
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
