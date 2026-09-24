import type {
  ProjectMemberRole,
  TeamMemberRole,
  TaskResponse,
} from "@/api/types";

export function isProjectManager(role?: ProjectMemberRole) {
  return role === "OWNER" || role === "MANAGER";
}

export function isProjectOwner(role?: ProjectMemberRole) {
  return role === "OWNER";
}

export function isTeamLeader(role?: TeamMemberRole) {
  return role === "LEADER";
}

export function canEditTask(
  task: TaskResponse,
  currentUserId: string | null,
  teamLeader: boolean,
) {
  if (!currentUserId) {
    return false;
  }

  return (
    task.createdBy === currentUserId ||
    task.assignedTo === currentUserId ||
    teamLeader
  );
}

export function canDeleteTask(
  task: TaskResponse,
  currentUserId: string | null,
  teamLeader: boolean,
) {
  if (!currentUserId) {
    return false;
  }

  return task.createdBy === currentUserId || teamLeader;
}