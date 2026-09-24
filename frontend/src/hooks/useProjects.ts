
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptProjectInvitation,
  createProject,
  deleteProject,
  getProjectById,
  getProjectDetails,
  getProjectsBySpace,
  rejectProjectInvitation,
  updateProject,
} from "@/api/apis/projects.api";

export function useProjectsBySpace(spaceId: string) {
  return useQuery({
    queryKey: ["projects", "space", spaceId],
    queryFn: () => getProjectsBySpace(spaceId),
    enabled: !!spaceId,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

export function useProjectDetails(id: string) {
  return useQuery({
    queryKey: ["projects", id, "details"],
    queryFn: () => getProjectDetails(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", "space", variables.spaceId],
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateProject>[1];
    }) => updateProject(id, data),

    onSuccess: (updatedProject, variables) => {
      // Refresh individual project
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.id],
      });

      // Refresh project details
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.id, "details"],
      });

      // Refresh project's space list
      if (updatedProject?.spaceId) {
        queryClient.invalidateQueries({
          queryKey: ["projects", "space", updatedProject.spaceId],
        });
      }
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; spaceId: string }) =>
      deleteProject(id),

    onSuccess: (_, variables) => {
      // Refresh projects inside the space
      queryClient.invalidateQueries({
        queryKey: ["projects", "space", variables.spaceId],
      });

      // Remove individual project cache
      queryClient.removeQueries({
        queryKey: ["projects", variables.id],
      });

      // Remove project details cache
      queryClient.removeQueries({
        queryKey: ["projects", variables.id, "details"],
      });
    },
  });
}



export function useAcceptProjectInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => acceptProjectInvitation(projectId, userId),

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
        queryKey: ["projects", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "details"],
      });
    },
  });
}

export function useRejectProjectInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => rejectProjectInvitation(projectId, userId),

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
        queryKey: ["projects", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "details"],
      });
    },
  });
}