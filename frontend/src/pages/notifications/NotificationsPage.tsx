
import {
  Bell,
  Check,
  CheckCheck,
  MessageCircle,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";

import type { NotificationResponse } from "@/api/types";

export default function NotificationsPage() {
  /*
   * Replace this with your React Query hook later:
   *
   * const {
   *   data: notifications = [],
   *   isLoading,
   *   isError,
   * } = useNotifications();
   */

  const notifications: NotificationResponse[] = [];

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <Bell className="h-7 w-7 text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Stay updated with your projects, teams, and tasks.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="flex w-fit items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              onClick={() => {
                // TODO: mark all notifications as read
              }}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-border bg-background shadow-sm">
        {notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function NotificationItem({
  notification,
}: {
  notification: NotificationResponse;
}) {
  const isUnread = !notification.read;

  return (
    <div
      className={`group flex gap-4 p-5 transition-colors ${
        isUnread ? "bg-primary/[0.03]" : "hover:bg-muted/30"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isUnread
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <NotificationIcon type={notification.type} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2">
            {isUnread && (
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}

            <p
              className={`text-sm leading-6 ${
                isUnread ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {notification.message}
            </p>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {formatNotificationDate(notification.createdAt)}
          </span>
        </div>

        {/* Action */}
        {isUnread && (
          <button
            type="button"
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary opacity-100 transition hover:underline sm:opacity-0 sm:group-hover:opacity-100"
            onClick={() => {
              // TODO: mark notification as read
              console.log("Mark as read:", notification.id);
            }}
          >
            <Check className="h-3.5 w-3.5" />
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}

function NotificationIcon({
  type,
}: {
  type: NotificationResponse["type"];
}) {
  switch (type) {
    case "TASK_ASSIGNED":
      return <Check className="h-5 w-5" />;

    case "TASK_UPDATED":
      return <RefreshCw className="h-5 w-5" />;

    case "TASK_COMMENTED":
      return <MessageCircle className="h-5 w-5" />;

    case "PROJECT_INVITATION":
      return <UserPlus className="h-5 w-5" />;

    case "TEAM_INVITATION":
      return <Users className="h-5 w-5" />;

    case "SYSTEM":
    default:
      return <Bell className="h-5 w-5" />;
  }
}

function EmptyNotifications() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Bell className="h-7 w-7 text-muted-foreground" />
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        You're all caught up
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        You don't have any notifications right now. New activity from
        your projects, teams, and tasks will appear here.
      </p>
    </div>
  );
}

function formatNotificationDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  const now = new Date();
  const diff = now.getTime() - parsed.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}m ago`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h ago`;
  }

  if (diff < 7 * day) {
    const days = Math.floor(diff / day);
    return `${days}d ago`;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: parsed.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
