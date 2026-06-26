"use client";

import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "@/components/auth/auth-provider";
import { LoginForm } from "@/components/auth/login-form";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

// Routes that are reachable without logging in (public parent application form).
const PUBLIC_PREFIXES = ["/prihlaska"];

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <LoginForm />;

  return (
    <>
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Public form: no auth, no CRM chrome.
  if (isPublic(pathname)) return <>{children}</>;

  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}
