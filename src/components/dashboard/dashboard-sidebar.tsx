"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftFromLine,
  Zap,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  dashboardNavigation,
  type UserRole,
} from "@/config/dashboard-navigation";
import { toast } from "../ui/toast";
import { useLogout } from "@/hooks";
import { Button } from "../ui/button";

interface DashboardSidebarProps {
  role: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  ADMIN: "System Administrator",
  ZONE_MANAGER: "Zone Manager",
  POWER_OPERATOR: "Power Operator",
  TECHNICIAN: "Field Technician",
  CUSTOMER: "Customer Account",
};

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const navigation = dashboardNavigation[role];

  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: async () => {
        await queryClient.cancelQueries();
        queryClient.clear();

        toast.add({
          title: "Goodbye!",
          description: "Logged out successfully",
          type: "success",
        });

        router.replace("/login");
        router.refresh();
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-background md:flex lg:w-72">
      {/* Brand */}
      <div className="flex h-19 shrink-0 items-center border-b px-5 lg:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="PowerGrid home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Zap size={23} fill="currentColor" />
          </span>

          <span className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">
              PowerGrid
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Operations platform
            </span>
          </span>
        </Link>
      </div>

      {/* Role information */}
      <div className="px-4 pt-5 lg:px-5">
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Signed in as
            </p>
            <p className="mt-1 truncate text-sm font-semibold">
              {roleLabels[role] ?? role.replaceAll("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-2 pt-7 lg:px-5">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Workspace
        </p>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="flex-1 space-y-1 overflow-y-auto px-4 pb-4 lg:px-5"
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-primary" />
              )}

              <Icon
                className={cn(
                  "size-4.5 shrink-0 transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                strokeWidth={active ? 2.2 : 1.8}
              />

              <span className="min-w-0 flex-1 truncate">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto shrink-0 border-t p-4 lg:p-5">

        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-transparent text-muted-foreground hover:border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={17} />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Button>

        <Link
          href="/"
          className="mt-3 flex items-center justify-center gap-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftFromLine size={14} />
          Back to homepage
        </Link>
      </div>
    </aside>
  );
}