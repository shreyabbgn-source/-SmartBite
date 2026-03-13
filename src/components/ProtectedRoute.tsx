"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "student" | "staff" | "admin";
  redirectTo?: string;
}

export function ProtectedRoute({ children, requiredRole, redirectTo }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in, redirect to appropriate login page
      const loginPages = {
        student: "/login",
        staff: "/staff/login",
        admin: "/admin/login",
      };
      router.push(redirectTo || loginPages[requiredRole]);
      return;
    }

    if (user?.role !== requiredRole) {
      // Logged in but wrong role, redirect to their appropriate dashboard
      const dashboards = {
        student: "/",
        staff: "/staff",
        admin: "/admin",
      };
      router.push(dashboards[user?.role as keyof typeof dashboards] || "/");
    }
  }, [isAuthenticated, user, requiredRole, router, redirectTo]);

  // Show loading while checking auth
  if (!isAuthenticated || user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
