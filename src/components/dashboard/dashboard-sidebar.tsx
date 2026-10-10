"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import {
    dashboardNavigation,
    type UserRole,
} from "@/config/dashboard-navigation";
import { toast } from "../ui/toast";
import { useLogout } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";

interface DashboardSidebarProps {
    role: UserRole;
}

export function DashboardSidebar({
    role,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const navigation = dashboardNavigation[role];
    const {mutate:logout} = useLogout();
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleLogout = () =>{
        logout(undefined, {
            onSuccess: () => {
                toast.add({
                    title: "Good Bye!",
                    description: "Logged out successfully",
                    type: "success",
                });
                queryClient.removeQueries({queryKey:["user"]});
                router.push("/login");
            },
            onError: () => {
                toast.add({
                    title: "Logout failed",
                    description: "Something Went Wrong",
                    type: "error",
                });
            },
        })
    }

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
                <Button onClick={handleLogout} variant="destructive">
                    Logout
                </Button>
            </nav>
        </aside>
    );
}