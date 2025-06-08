import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function AdminRoute() {
  const { user } = useAuth();

  const isAdmin = user && user.role === "ADMIN";

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}
