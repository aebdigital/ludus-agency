"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Clapperboard,
  Settings,
  Drama,
  Inbox,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";

const nav = [
  { label: "Študenti", href: "/students", icon: Users },
  { label: "Projekty", href: "/productions", icon: Clapperboard },
  { label: "Prihlášky", href: "/applications", icon: Inbox },
  { label: "Nastavenia", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (href: string) => pathname.startsWith(href);

  const email = user?.email ?? "";
  const initials = (email.slice(0, 2) || "??").toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      {/* Značka */}
      <Link href="/students" className="flex h-16 items-center gap-3 px-5">
        <div
          className="flex size-9 items-center justify-center rounded-lg text-white shadow-pop"
          style={{
            backgroundImage:
              "linear-gradient(135deg, oklch(0.62 0.18 300), oklch(0.5 0.2 280))",
          }}
        >
          <Drama className="size-5" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-white">
            Ludus Agency
          </div>
        </div>
      </Link>

      {/* Navigácia */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-white"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
              )}
              <item.icon
                className={cn(
                  "size-[18px] shrink-0",
                  active ? "text-sidebar-primary" : ""
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Používateľ */}
      <div className="flex items-center gap-3 border-t border-sidebar-border px-4 py-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{
            backgroundImage:
              "linear-gradient(135deg, oklch(0.65 0.13 200), oklch(0.55 0.15 250))",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-medium text-white">
            {email || "Neprihlásený"}
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          title="Odhlásiť sa"
          aria-label="Odhlásiť sa"
          className="shrink-0 rounded-md p-1.5 text-sidebar-muted transition-colors hover:bg-sidebar-accent/60 hover:text-white"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  );
}
