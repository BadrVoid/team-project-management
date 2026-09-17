import { api } from "../axios";
import { endpoints } from "../endpoints";

import type {
  GlobalResponse,
  SpaceResponse,
  PublicSpaceResponse,

} from "../types";

export interface CreateSpaceRequest {
  name: string;
  description?: string;
  visibility: "PRIVATE" | "PUBLIC";
}

export interface UpdateSpaceRequest {
  name: string;
  description?: string;
}

export async function getMySpaces(): Promise<SpaceResponse[]> {
  const response = await api.get<GlobalResponse<SpaceResponse[]>>(
    endpoints.spaces.my,
  );

  return response.data.data;
}

export async function createSpace(
  data: CreateSpaceRequest,
): Promise<SpaceResponse> {
  const response = await api.post<GlobalResponse<SpaceResponse>>(
    endpoints.spaces.create,
    data,
  );

  return response.data.data;
}

export async function getSpaceById(
  id: string,
): Promise<SpaceResponse> {
  const response = await api.get<GlobalResponse<SpaceResponse>>(
    endpoints.spaces.byId(id),
  );

  return response.data.data;
}

export async function updateSpace(
  id: string,
  data: UpdateSpaceRequest,
): Promise<SpaceResponse> {
  const response = await api.put<GlobalResponse<SpaceResponse>>(
    endpoints.spaces.byId(id),
    data,
  );

  return response.data.data;
}

export async function deleteSpace(id: string): Promise<void> {
  await api.delete(endpoints.spaces.byId(id));
}
export async function getPublicSpaces(): Promise<
  PublicSpaceResponse[]
> {
  const response = await api.get<
    GlobalResponse<PublicSpaceResponse[]>
  >(endpoints.spaces.public);

  return response.data.data;
}

export async function joinSpace(
  id: string,
): Promise<PublicSpaceResponse> {
  const response = await api.post<
    GlobalResponse<PublicSpaceResponse>
  >(endpoints.spaces.join(id));

  return response.data.data;
}