// components/PublicRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return !isLoggedIn ? <>{children}</> : <Navigate to="/blogs" replace />;
}
