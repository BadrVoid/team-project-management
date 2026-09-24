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

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<
      GlobalResponse<string>
    >(endpoints.profiles.avatar, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },
};