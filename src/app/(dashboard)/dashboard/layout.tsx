"use client";

import { useEffect, useState } from "react";

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
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/shared/page-loader";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    
    const {data, isLoading, isError} = useGetMe();
    const user = data?.data;
    useEffect(()=>{
        if(!isLoading && (isError || !user)){
            router.replace("/login");
        }
    },[isLoading, isError, user, router])
   
    if (isLoading || isError || !user) {
        return <PageLoader />
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