// components/PublicRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <Spinner />
  return !isLoggedIn ? <>{children}</> : <Navigate to="/blogs" replace />;
}
