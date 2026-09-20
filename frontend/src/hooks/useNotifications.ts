
// src/hooks/useNotifications.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/api/apis/notifications.api";

// Query Keys

const notificationKeys = {
  all: ["notifications"] as const,
  unread: ["notifications", "unread"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

// Get All Notifications

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
  });
}

// Get Unread Notifications

export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unread,
    queryFn: getUnreadNotifications,
  });
}

// Get Unread Notification Count

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadNotificationCount,

    // Keep the sidebar badge fresh.
    refetchInterval: 30_000,
  });
}

// Mark Notification As Read

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: notificationKeys.unread,
      });

      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount,
      });
    },
  });
}

// Mark All Notifications As Read

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: notificationKeys.unread,
      });

      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount,
      });
    },
  });
}

// Delete Notification

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: notificationKeys.unread,
      });

      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount,
      });
    },
  });
}

// Export Query Keys

export { notificationKeys };
