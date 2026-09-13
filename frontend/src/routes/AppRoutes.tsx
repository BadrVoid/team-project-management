import { Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "@/pages/auth/AuthPage";
import HomePage from "@/pages/home/HomePage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
      </Route>

      {/* Unknown route */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
