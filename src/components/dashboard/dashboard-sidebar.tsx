"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
    dashboardNavigation,
    type UserRole,
} from "@/config/dashboard-navigation";

interface DashboardSidebarProps {
    role: UserRole;
}

export function DashboardSidebar({
    role,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const navigation = dashboardNavigation[role];

    return (
        <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
            <div className="flex h-16 items-center border-b px-6">
                <Link
                    href="/"
                    className="text-xl font-bold"
                >
                    PowerGrid
                </Link>
            </div>

            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                            pathname.startsWith(
                                item.href,
                            ));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                "hover:bg-muted",
                                isActive &&
                                    "bg-primary text-primary-foreground hover:bg-primary",
                            )}
                        >
                            <Icon className="size-4" />

                            <span>
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}