
import { api } from "../axios";
import { endpoints } from "../endpoints";
import type {
  GlobalResponse,
  UserDiscoveryResponse,
} from "../types";

export interface UserDiscoveryParams {
  keyword?: string;
  skill?: string;
  tag?: string;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const usersApi = {
  async discoverUsers(
    params?: UserDiscoveryParams,
  ): Promise<PageResponse<UserDiscoveryResponse>> {
    const response = await api.get<
      GlobalResponse<PageResponse<UserDiscoveryResponse>>
    >(endpoints.users.discover, {
      params,
    });

    return response.data.data;
  },
};

