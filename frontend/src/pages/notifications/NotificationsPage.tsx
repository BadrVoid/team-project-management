import { Bell, Check, Trash2 } from "lucide-react";

import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks/useNotifications";

import {
  getNotificationIcon,
  getNotificationTypeLabel,
} from "@/components/notifications/notification-utils";

import { Button } from "@/components/ui/button";

export default function Notifications() {
  const { data: notifications = [], isLoading } = useNotifications();

  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>

          <p className="text-sm text-muted-foreground">
            Stay up to date with your projects, teams, tasks, and spaces.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            className="shrink-0 gap-2"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <Check className="h-4 w-4" />

            {markAllAsRead.isPending ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </div>

      {/* Empty */}
      {notifications.length === 0 && (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            p-12
            text-center
          "
        >
          <Bell className="mb-3 h-10 w-10 text-muted-foreground" />

          <h2 className="font-semibold">No notifications</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            You don't have any notifications yet.
          </p>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="overflow-hidden rounded-xl border">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);

            return (
              <div
                key={notification.id}
                className={`
                  flex
                  gap-4
                  border-b
                  p-4
                  last:border-b-0
                  transition-colors
                  hover:bg-muted/50
                  ${!notification.read ? "bg-primary/5" : ""}
                `}
              >
                {/* Icon */}
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-primary/10
                    text-primary
                  "
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">
                      {getNotificationTypeLabel(notification.type)}
                    </span>

                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>

                  <p className="mt-1 text-sm">{notification.message}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Mark as read"
                      onClick={() => markAsRead.mutate(notification.id)}
                      disabled={markAsRead.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    onClick={() => deleteNotification.mutate(notification.id)}
                    disabled={deleteNotification.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
