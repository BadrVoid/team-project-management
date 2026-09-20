// Global Response

export interface GlobalResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Auth

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// User

export type UserRole = "USER" | "ADMIN";

export interface UserSummaryResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  verified: boolean;
  banned: boolean;
}

export interface UserDiscoveryResponse {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  bio: string | null;
  avatarUrl: string | null;
  skills: string[];
  tags: string[];
}

// Space

export type SpaceVisibility = "PRIVATE" | "PUBLIC";

export interface SpaceResponse {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  visibility: SpaceVisibility;
}

export type SpaceMembershipStatus =
  | "NONE"
  | "PENDING"
  | "MEMBER"
  | "OWNER";

export interface PublicSpaceResponse {
  id: string;
  name: string;
  description: string;
  visibility: SpaceVisibility;
  ownerId: string;
  membershipStatus: SpaceMembershipStatus;
}

// Project

export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED";

export interface ProjectResponse {
  id: string;
  spaceId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  createdBy: string;
}

export type ProjectMemberRole =
  | "OWNER"
  | "MANAGER"
  | "MEMBER";

export type MembershipStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

export interface ProjectMemberRequest {
  userId: string;
  role: ProjectMemberRole;
}

export interface ProjectMemberResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  role: ProjectMemberRole;
  status: MembershipStatus;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
}

export interface TeamSummaryResponse {
  id: string;
  name: string;
  description: string;
}

export interface ProjectDetailsResponse {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  createdBy: UserSummaryResponse;
  members: ProjectMemberResponse[];
  teams: TeamSummaryResponse[];
}

// Team

export interface TeamResponse {
  id: string;
  projectId: string;
  name: string;
  description: string;
}

export interface TeamCreateRequest {
  projectId: string;
  name: string;
  description?: string;
}

export interface TeamUpdateRequest {
  name: string;
  description?: string;
}

export type TeamMemberRole =
  | "LEADER"
  | "MEMBER";

export interface TeamMemberRequest {
  userId: string;
  role: TeamMemberRole;
}

export interface TeamMemberResponse {
  id: string;
  teamId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamMemberRole;
}

// Task

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface TaskResponse {
  id: string;
  teamId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignedTo: string | null;
  createdBy: string;
}

export interface TaskDetailsResponse {
  id: string;
  teamId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignedTo: UserSummaryResponse | null;
  createdBy: UserSummaryResponse;
}

// Notification

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_COMMENTED"
  | "PROJECT_INVITATION"
  | "TEAM_INVITATION"
  | "SPACE_JOIN_REQUEST"
  | "SPACE_JOIN_REQUEST_ACCEPTED"
  | "SPACE_JOIN_REQUEST_REJECTED"
  | "SYSTEM";

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}

// Profile

export type AuthProvider =
  | "GOOGLE"
  | "GITHUB";

export interface UserProfileRequest {
  bio?: string;
  university?: string;
  department?: string;
  avatarUrl?: string;
  skills?: string[];
  tags?: string[];
}

export interface UserProfileResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider | null;
  bio: string | null;
  university: string | null;
  department: string | null;
  avatarUrl: string | null;
  skills: string[];
  tags: string[];
}
