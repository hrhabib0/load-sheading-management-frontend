"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import {
    dashboardNavigation,
    type UserRole,
} from "@/config/dashboard-navigation";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
    role: UserRole;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({
    role,
    open,
    onOpenChange,
}: MobileSidebarProps) {
    const pathname = usePathname();

    const navigation =
        dashboardNavigation[role];

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                side="left"
                className="w-72 p-0"
            >
                <SheetHeader className="border-b px-6 py-4">
                    <SheetTitle>
                        <Link
                            href="/dashboard"
                            onClick={() =>
                                onOpenChange(false)
                            }
                        >
                            PowerGrid
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <nav className="space-y-1 p-4">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            pathname === item.href ||
                            (item.href !==
                                "/dashboard" &&
                                pathname.startsWith(
                                    item.href,
                                ));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() =>
                                    onOpenChange(false)
                                }
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                                    "hover:bg-muted",
                                    isActive &&
                                        "bg-primary text-primary-foreground hover:bg-primary",
                                )}
                            >
                                <Icon className="size-4" />

                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
}