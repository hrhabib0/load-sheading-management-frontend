"use client"
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { PageLoader } from "@/components/shared/page-loader";
import { useGetMe, useGetMyAreaLoadShedding, useGetMyCustomerProfile, useGetMyCustomerReports } from "@/hooks";
import { useGetMyAreaOutageStatus } from "@/hooks/outage.hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const router = useRouter();
    const {data, isLoading: isUserLoading, isError} = useGetMe();
    const user = data?.data;
    useEffect(()=>{
        if(!user){
            router.replace("/login");
        }
    },[ user, router])

    console.log(user.role, "user role")

    const {
        data: customerProfile,
        isLoading: isProfileLoading,
    } = useGetMyCustomerProfile();

    const {
        data: customerReports,
        isLoading: isReportsLoading,
    } = useGetMyCustomerReports();

    const {
        data: loadSheddingData,
        isLoading: isLoadSheddingLoading,
    } = useGetMyAreaLoadShedding();

    const loadSheddingSchedules = loadSheddingData?.data ?? [];

    const {
            data: outageStatusData,
            isLoading: isOutageStatusLoading,
        } = useGetMyAreaOutageStatus();

       
    if (
        isUserLoading ||
        isProfileLoading ||
        isReportsLoading ||
        isLoadSheddingLoading ||
        isOutageStatusLoading ||
        isError ||
        !user
    ) {
        return <PageLoader />
    }


    return (
        <DashboardContent 
            role={user.role} 
            customerProfile={customerProfile?.data}
            customerReports={customerReports?.data}
            loadsheddingSchedules={loadSheddingSchedules}
            outageStatus={outageStatusData?.data}
        />
    );
}