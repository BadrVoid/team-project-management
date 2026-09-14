// src/api/notifications.api.ts

import { api } from "./axios";
import { endpoints } from "./endpoints";
import type {
  GlobalResponse,
  NotificationResponse,
} from "./types";

export async function getNotifications(): Promise<
  NotificationResponse[]
> {
  const response = await api.get<
    GlobalResponse<NotificationResponse[]>
  >(endpoints.notifications.all);

  return response.data.data;
}