import { Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "@/pages/auth/AuthPage";
import OAuthCallback from "@/pages/auth/OAuthCallback";

import AppLayout from "@/components/layout/AppLayout";

import DashboardPage from "@/pages/dashboard/DashboardPage";

import SpacesPage from "@/pages/spaces/SpacesPage";
import PublicSpacesPage from "@/pages/spaces/PublicSpacesPage";
import SpaceDetailsPage from "@/pages/spaces/SpaceDetailsPage";

import WorkspacePage from "@/pages/workspace/WorkspacePage";
import ProjectDetailsPage from "@/pages/projects/ProjectDetailsPage";

import NotificationsPage from "@/pages/notifications/NotificationsPage";
import TaskDetailsPage from "@/pages/tasks/TaskDetailsPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import SettingsPage from "@/pages/settings/SettingsPage";
import TeamDetailsPage from "@/pages/teams/TeamDetailsPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import PublicRoute from "./PublicRoute";
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
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* =========================
              Spaces
          ========================= */}

          <Route path="/spaces" element={<SpacesPage />} />

          <Route path="/spaces/discover" element={<PublicSpacesPage />} />

          <Route path="/spaces/:spaceId" element={<SpaceDetailsPage />} />

          {/* =========================
              Workspace
          ========================= */}

          <Route path="/workspace" element={<WorkspacePage />} />

          {/* =========================
              Project Details
          ========================= */}

          <Route path="/projects/:id" element={<ProjectDetailsPage />} />

          {/* =========================
              Notifications
          ========================= */}

          <Route path="/notifications" element={<NotificationsPage />} />

          {/* =========================
              Settings
          ========================= */}

          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          {/* =========================
              Profile
          ========================= */}
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/teams/:id" element={<TeamDetailsPage />} />
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
