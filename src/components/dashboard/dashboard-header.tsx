"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/auth.type";

interface DashboardUser {
    name: string;
    email: string;
    role: UserRole;
}

interface DashboardHeaderProps {
    user: DashboardUser,
    onMenuClick: () => void;
}

export function DashboardHeader({
    user,
    onMenuClick,
}: DashboardHeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                >
                    <span className="text-xl">
                        ☰
                    </span>

                    <span className="sr-only">
                        Open navigation
                    </span>
                </Button>

                <Link
                    href="/dashboard"
                    className="text-lg font-bold md:hidden"
                >
                    PowerGrid
                </Link>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <Button
                    variant="ghost"
                    nativeButton={false}
                    size="icon"
                    render={
                        <Link href="/dashboard/notifications" />
                    }
                >
                    <Bell className="size-5" />

                    <span className="sr-only">
                        Notifications
                    </span>
                </Button>
                <div className="hidden border-l pl-3 sm:block">
                    <p className="text-sm font-medium">
                        {user.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {user.role
                            .replaceAll("_", " ")
                            .toLowerCase()
                            .replace(
                                /\b\w/g,
                                (char) =>
                                    char.toUpperCase(),
                            )}
                    </p>
                </div>
            </div>
        </header>
    );
}