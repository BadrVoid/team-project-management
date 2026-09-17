import { Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "@/pages/auth/AuthPage";
import OAuthCallback from "@/pages/auth/OAuthCallback";

import AppLayout from "@/components/layout/AppLayout";
import PublicSpacesPage from "@/pages/spaces/PublicSpacesPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import SpacesPage from "@/pages/spaces/SpacesPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import SpaceDetailsPage from "@/pages/spaces/SpaceDetailsPage";
export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/spaces/discover" element={<PublicSpacesPage />} />
          <Route path="/spaces/:spaceId" element={<SpaceDetailsPage />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/projects" element={<div>Projects</div>} />

          <Route path="/teams" element={<div>Teams</div>} />

          <Route path="/tasks" element={<div>Tasks</div>} />

          <Route path="/notifications" element={<div>Notifications</div>} />

          <Route path="/settings" element={<div>Settings</div>} />
        </Route>
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
