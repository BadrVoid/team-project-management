// src/api/spaces.api.ts

import { api } from "./axios";
import { endpoints } from "./endpoints";
import type { GlobalResponse, SpaceResponse } from "./types";

export async function getMySpaces(): Promise<SpaceResponse[]> {
  const response = await api.get<GlobalResponse<SpaceResponse[]>>(
    endpoints.spaces.my,
  );

  return response.data.data;
}