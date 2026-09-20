import {
  Bell,
  Check,
  ClipboardCheck,
  MessageCircle,
  UserPlus,
  Users,
  FolderKanban,
} from "lucide-react";

import type { NotificationType } from "@/api/types";

export function getNotificationIcon(
  type: NotificationType
) {

  switch (type) {

    case "TASK_ASSIGNED":
      return ClipboardCheck;

    case "TASK_UPDATED":
      return Check;

    case "TASK_COMMENTED":
      return MessageCircle;

    case "PROJECT_INVITATION":
      return FolderKanban;

    case "TEAM_INVITATION":
      return Users;

    case "SPACE_JOIN_REQUEST":
      return UserPlus;

    case "SPACE_JOIN_REQUEST_ACCEPTED":
      return Check;

    case "SPACE_JOIN_REQUEST_REJECTED":
      return UserPlus;

    case "SYSTEM":
    default:
      return Bell;
  }
}

export function getNotificationTypeLabel(
  type: NotificationType
): string {

  switch (type) {

    case "TASK_ASSIGNED":
      return "Task assigned";

    case "TASK_UPDATED":
      return "Task updated";

    case "TASK_COMMENTED":
      return "New comment";

    case "PROJECT_INVITATION":
      return "Project invitation";

    case "TEAM_INVITATION":
      return "Team invitation";

    case "SPACE_JOIN_REQUEST":
      return "Space join request";

    case "SPACE_JOIN_REQUEST_ACCEPTED":
      return "Join request accepted";

    case "SPACE_JOIN_REQUEST_REJECTED":
      return "Join request rejected";

    case "SYSTEM":
      return "System";

    default:
      return "Notification";
  }
}