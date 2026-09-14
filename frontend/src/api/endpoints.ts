// src/api/endpoints.ts

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    refreshToken: "/auth/refresh",
    logout: "/auth/logout",
    changePassword: "/auth/change-password",
  },

  spaces: {
    my: "/spaces/my",
  },

  projects: {
    bySpace: (spaceId: string) => `/projects/space/${spaceId}`,
    byId: (id: string) => `/projects/${id}`,
    details: (id: string) => `/projects/${id}/details`,
  },

  teams: {
    byProject: (projectId: string) => `/teams/project/${projectId}`,
    byId: (id: string) => `/teams/${id}`,
  },

  tasks: {
    my: "/tasks/my",
    byTeam: (teamId: string) => `/tasks/team/${teamId}`,
    byId: (id: string) => `/tasks/${id}`,
    details: (id: string) => `/tasks/${id}/details`,
  },

  notifications: {
    all: "/notifications",
    unread: "/notifications/unread",
    unreadCount: "/notifications/unread/count",
    read: (id: string) => `/notifications/${id}/read`,
    readAll: "/notifications/read-all",
    byId: (id: string) => `/notifications/${id}`,
  },

  users: {
    me: "/users/me",
    all: "/users",
    byId: (id: string) => `/users/${id}`,
    discover: "/users/discover",
  },
};