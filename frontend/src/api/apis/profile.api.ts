
import { api } from "../axios";
import { endpoints } from "../endpoints";
import type {
  GlobalResponse,
  UserProfileRequest,
  UserProfileResponse,
} from "../types";

export const profileApi = {
  async getMyProfile(): Promise<UserProfileResponse> {
    const response = await api.get<
      GlobalResponse<UserProfileResponse>
    >(endpoints.profiles.me);

    return response.data.data;
  },

  async updateMyProfile(
    data: UserProfileRequest,
  ): Promise<UserProfileResponse> {
    const response = await api.put<
      GlobalResponse<UserProfileResponse>
    >(endpoints.profiles.me, data);

    return response.data.data;
  },
};
