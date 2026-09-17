import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSpace,
  deleteSpace,
  getMySpaces,
  getPublicSpaces,
  getSpaceById,
  joinSpace,
  updateSpace,
} from "@/api/apis/spaces.api";

export function useSpaces() {
  return useQuery({
    queryKey: ["spaces", "my"],
    queryFn: getMySpaces,
  });
}
export function useSpace(id: string) {
  return useQuery({
    queryKey: ["spaces", id],
    queryFn: () => getSpaceById(id),
    enabled: !!id,
  });
}
export function usePublicSpaces() {
  return useQuery({
    queryKey: ["spaces", "public"],
    queryFn: getPublicSpaces,
  });
}

export function useCreateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["spaces", "my"],
      });
    },
  });
}

export function useUpdateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateSpace>[1];
    }) => updateSpace(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["spaces", "my"],
      });

      queryClient.invalidateQueries({
        queryKey: ["spaces", variables.id],
      });
    },
  });
}

export function useDeleteSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["spaces", "my"],
      });
    },
  });
}

export function useJoinSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinSpace,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["spaces", "public"],
      });
    },
  });
}