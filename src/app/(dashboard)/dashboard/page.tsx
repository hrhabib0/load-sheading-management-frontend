"use client"
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { PageLoader } from "@/components/shared/page-loader";
import { useGetMe } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const router = useRouter();
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
        <DashboardContent role={user.role} />
    );
}