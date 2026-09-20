import { api } from "../axios";
import type {
  GlobalResponse,
  NotificationResponse,
} from "@/api/types";

// =========================
// Get All Notifications
// =========================

export const getNotifications = async (): Promise<
  NotificationResponse[]
> => {
  const response = await api.get<
    GlobalResponse<NotificationResponse[]>
  >("/notifications");

  return response.data.data;
};

// =========================
// Get Unread Notifications
// =========================

export const getUnreadNotifications = async (): Promise<
  NotificationResponse[]
> => {
  const response = await api.get<
    GlobalResponse<NotificationResponse[]>
  >("/notifications/unread");

  return response.data.data;
};

// =========================
// Get Unread Count
// =========================

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get<GlobalResponse<number>>(
    "/notifications/unread/count"
  );

  return response.data.data;
};

// =========================
// Mark Notification As Read
// =========================

export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  await api.patch(
    `/notifications/${notificationId}/read`
  );
};

// =========================
// Mark All Notifications As Read
// =========================

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch("/notifications/read-all");
};

// =========================
// Delete Notification
// =========================

export const deleteNotification = async (
  notificationId: string
): Promise<void> => {
  await api.delete(
    `/notifications/${notificationId}`
  );
};

