"use client";

import { useState } from "react";

import {
    DashboardHeader,
} from "@/components/dashboard/dashboard-header";

import {
    DashboardSidebar,
} from "@/components/dashboard/dashboard-sidebar";

import {
    MobileSidebar,
} from "@/components/dashboard/mobile-sidebar";
import { useGetMe } from "@/hooks";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    /*
     * Temporary role.
     *
     * We'll replace this with the
     * authenticated user's role from
     * useMe() shortly.
     */
    // const role = "CUSTOMER" as const;

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    
    const {data, isLoading, isError} = useGetMe();
   
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Loading dashboard...
                </p>
            </div>
        );
    }
    const user = data.data;

    if (isError || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">
                        Unable to load your account
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Please login again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-muted/30">
            <DashboardSidebar role={user.role} />
            <MobileSidebar
                role={user.role}
                open={mobileSidebarOpen}
                onOpenChange={setMobileSidebarOpen}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader
                    user = {user}
                    onMenuClick={() =>
                        setMobileSidebarOpen(true)
                    }
                />

                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}