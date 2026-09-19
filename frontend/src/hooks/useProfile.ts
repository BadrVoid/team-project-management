import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/api/apis/profile.api";
import type { UserProfileRequest } from "@/api/types";

export function useMyProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: profileApi.getMyProfile,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfileRequest) =>
      profileApi.updateMyProfile(data),

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(
        ["profile", "me"],
        updatedProfile,
      );
    },
  });
}