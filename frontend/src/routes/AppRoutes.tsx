import { Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "@/pages/auth/AuthPage";
import OAuthCallback from "@/pages/auth/OAuthCallback";

import AppLayout from "@/components/layout/AppLayout";

import DashboardPage from "@/pages/dashboard/DashboardPage";

import SpacesPage from "@/pages/spaces/SpacesPage";
import PublicSpacesPage from "@/pages/spaces/PublicSpacesPage";
import SpaceDetailsPage from "@/pages/spaces/SpaceDetailsPage";

import ProjectDetailsPage from "@/pages/projects/ProjectDetailsPage";

import TeamDetailsPage from "@/pages/teams/TeamDetailsPage";

import TaskDetailsPage from "@/pages/tasks/TaskDetailsPage";

import NotificationsPage from "@/pages/notifications/NotificationsPage";

import SettingsPage from "@/pages/settings/SettingsPage";
import ProfilePage from "@/pages/profile/ProfilePage";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "./PublicRoute";
import WorkspacePage from "@/pages/workspace/WorkspacePage";
export function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          Public Routes
      ========================= */}

      <Route element={<PublicRoute />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      <Route path="/oauth/callback" element={<OAuthCallback />} />

      {/* =========================
          Protected Routes
      ========================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* =========================
              Dashboard
          ========================= */}

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />

          {/* =========================
              Spaces
          ========================= */}

          <Route path="/spaces" element={<SpacesPage />} />

          <Route path="/spaces/discover" element={<PublicSpacesPage />} />

          <Route path="/spaces/:spaceId" element={<SpaceDetailsPage />} />

          {/* =========================
              Projects
          ========================= */}

          <Route path="/projects/:id" element={<ProjectDetailsPage />} />

          {/* =========================
              Teams
          ========================= */}

          <Route path="/teams/:id" element={<TeamDetailsPage />} />

          {/* =========================
              Tasks
          ========================= */}

          <Route path="/tasks/:id" element={<TaskDetailsPage />} />

          {/* =========================
              Notifications
          ========================= */}

          <Route path="/notifications" element={<NotificationsPage />} />

          {/* =========================
              Settings
          ========================= */}

          <Route path="/settings" element={<SettingsPage />} />

          {/* =========================
              Profile
          ========================= */}

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* =========================
          Default Redirect
      ========================= */}

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* =========================
          Unknown Route
      ========================= */}

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
