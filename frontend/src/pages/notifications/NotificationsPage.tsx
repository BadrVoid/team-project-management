import { useState } from "react";
import {
  Bell,
  Check,
  Mail,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { getUserIdFromToken } from "@/utils/jwt";

import {
  useAcceptProjectInvitation,
  useRejectProjectInvitation,
} from "@/hooks/useProjects";

import {
  useAcceptTeamInvitation,
  useRejectTeamInvitation,
} from "@/hooks/useTeams";

import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks/useNotifications";

import {
  getNotificationIcon,
  getNotificationPath,
  getNotificationTypeLabel,
} from "@/components/notifications/notification-utils";

import { Button } from "@/components/ui/button";

type FilterTab = "all" | "unread" | "invitations";

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const { accessToken } = useAuth();
  const currentUserId = getUserIdFromToken(accessToken);

  const { data: notifications = [], isLoading } = useNotifications();

  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  const acceptProjectInvitation = useAcceptProjectInvitation();
  const rejectProjectInvitation = useRejectProjectInvitation();

  const acceptTeamInvitation = useAcceptTeamInvitation();
  const rejectTeamInvitation = useRejectTeamInvitation();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Filter Skeleton */}
        <div className="h-10 w-80 animate-pulse rounded-xl bg-muted" />

        {/* Notifications Skeleton */}
        <div className="overflow-hidden rounded-xl border">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 border-b p-4 last:border-b-0"
            >
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const invitationCount = notifications.filter(
    (n) => n.type === "PROJECT_INVITATION" || n.type === "TEAM_INVITATION"
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "invitations") {
      return (
        notification.type === "PROJECT_INVITATION" ||
        notification.type === "TEAM_INVITATION"
      );
    }
    return true;
  });

  const isInvitationActionPending =
    acceptProjectInvitation.isPending ||
    rejectProjectInvitation.isPending ||
    acceptTeamInvitation.isPending ||
    rejectTeamInvitation.isPending;

  const handleNotificationClick = (
    notificationId: string,
    read: boolean,
    type: Parameters<typeof getNotificationPath>[0],
    referenceId: string | null,
  ) => {
    if (!read) {
      markAsRead.mutate(notificationId);
    }

    const path = getNotificationPath(type, referenceId);

    if (path) {
      navigate(path);
    }
  };

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
            <Check className="size-4" />
            {markAllAsRead.isPending ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-2xl border bg-background p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all ${
            activeTab === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          All
          <span
            className={`rounded-full px-1.5 text-xs ${
              activeTab === "all"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {notifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("unread")}
          className={`flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all ${
            activeTab === "unread"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span
              className={`rounded-full px-1.5 text-xs ${
                activeTab === "unread"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invitations")}
          className={`flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all ${
            activeTab === "invitations"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Invitations
          {invitationCount > 0 && (
            <span
              className={`rounded-full px-1.5 text-xs ${
                activeTab === "invitations"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {invitationCount}
            </span>
          )}
        </button>
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            {activeTab === "invitations" ? (
              <Mail className="size-6" />
            ) : (
              <Bell className="size-6" />
            )}
          </div>

          <h2 className="font-semibold">
            {activeTab === "unread"
              ? "No unread notifications"
              : activeTab === "invitations"
              ? "No pending invitations"
              : "No notifications"}
          </h2>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {activeTab === "unread"
              ? "You've read all your notifications. Check the 'All' tab to view past activity."
              : activeTab === "invitations"
              ? "You don't have any project or team invitations right now."
              : "You're all caught up. New activity from your projects, teams, tasks, and spaces will appear here."}
          </p>
        </div>
      )}

      {/* Notifications List */}
      {filteredNotifications.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-card">
          {filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);

            const path = getNotificationPath(
              notification.type,
              notification.referenceId,
            );

            const isProjectInvitation =
              notification.type === "PROJECT_INVITATION" &&
              !!notification.referenceId;

            const isTeamInvitation =
              notification.type === "TEAM_INVITATION" &&
              !!notification.referenceId;

            const isAcceptingProjectInvitation =
              acceptProjectInvitation.isPending &&
              acceptProjectInvitation.variables?.projectId ===
                notification.referenceId;

            const isRejectingProjectInvitation =
              rejectProjectInvitation.isPending &&
              rejectProjectInvitation.variables?.projectId ===
                notification.referenceId;

            const isAcceptingTeamInvitation =
              acceptTeamInvitation.isPending &&
              acceptTeamInvitation.variables?.teamId ===
                notification.referenceId;

            const isRejectingTeamInvitation =
              rejectTeamInvitation.isPending &&
              rejectTeamInvitation.variables?.teamId ===
                notification.referenceId;

            return (
              <div
                key={notification.id}
                role={path ? "button" : undefined}
                tabIndex={path ? 0 : undefined}
                onClick={() =>
                  handleNotificationClick(
                    notification.id,
                    notification.read,
                    notification.type,
                    notification.referenceId,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();

                    handleNotificationClick(
                      notification.id,
                      notification.read,
                      notification.type,
                      notification.referenceId,
                    );
                  }
                }}
                className={`
                  group flex gap-4 border-b p-4
                  last:border-b-0
                  transition-colors
                  ${path ? "cursor-pointer hover:bg-muted/50" : ""}
                  ${!notification.read ? "bg-primary/[0.04]" : ""}
                `}
              >
                {/* Notification Icon */}
                <div
                  className={`
                    flex size-10 shrink-0 items-center
                    justify-center rounded-full
                    ${
                      !notification.read
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  <Icon className="size-5" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {/* Type */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        text-xs font-medium
                        ${
                          !notification.read
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                      `}
                    >
                      {getNotificationTypeLabel(notification.type)}
                    </span>

                    {!notification.read && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                  </div>

                  {/* Message */}
                  <p className="mt-1 text-sm leading-5">
                    {notification.message}
                  </p>

                  {/* Date */}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>

                  {/* Invitation Actions */}
                  {(isProjectInvitation || isTeamInvitation) && (
                    <div
                      className="mt-3 flex items-center gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {/* Accept */}
                      <Button
                        size="sm"
                        disabled={!currentUserId || isInvitationActionPending}
                        onClick={() => {
                          if (!currentUserId || !notification.referenceId) {
                            return;
                          }

                          if (isProjectInvitation) {
                            acceptProjectInvitation.mutate({
                              projectId: notification.referenceId,
                              userId: currentUserId,
                            });
                          }

                          if (isTeamInvitation) {
                            acceptTeamInvitation.mutate({
                              teamId: notification.referenceId,
                              userId: currentUserId,
                            });
                          }
                        }}
                      >
                        {isAcceptingProjectInvitation ||
                        isAcceptingTeamInvitation
                          ? "Accepting..."
                          : "Accept"}
                      </Button>

                      {/* Reject */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!currentUserId || isInvitationActionPending}
                        onClick={() => {
                          if (!currentUserId || !notification.referenceId) {
                            return;
                          }

                          if (isProjectInvitation) {
                            rejectProjectInvitation.mutate({
                              projectId: notification.referenceId,
                              userId: currentUserId,
                            });
                          }

                          if (isTeamInvitation) {
                            rejectTeamInvitation.mutate({
                              teamId: notification.referenceId,
                              userId: currentUserId,
                            });
                          }
                        }}
                      >
                        {isRejectingProjectInvitation ||
                        isRejectingTeamInvitation
                          ? "Rejecting..."
                          : "Reject"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Notification Actions */}
                <div
                  className="flex shrink-0 gap-1"
                  onClick={(event) => event.stopPropagation()}
                >
                  {/* Mark as Read */}
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Mark as read"
                      onClick={() => markAsRead.mutate(notification.id)}
                      disabled={markAsRead.isPending}
                    >
                      <Check className="size-4" />
                    </Button>
                  )}

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    onClick={() => deleteNotification.mutate(notification.id)}
                    disabled={deleteNotification.isPending}
                  >
                    <Trash2 className="size-4" />
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