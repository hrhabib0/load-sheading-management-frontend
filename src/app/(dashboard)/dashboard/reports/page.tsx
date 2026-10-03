"use client";

import { AlertTriangle, CalendarDays, FileText } from "lucide-react";

import { useCancelCustomerReport, useGetMe, useGetMyCustomerReports } from "@/hooks";

import { PageLoader } from "@/components/shared/page-loader";
import { useGetAllCustomerReports } from "@/hooks/report.hook";
import { CustomerReports } from "@/components/dashboard/reports/customer-reports";
import { OperationalReports } from "@/components/dashboard/reports/operational-reports";


export default function ReportsPage() {
  const { data: userData, isLoading: isUserLoading } = useGetMe();

  const role = userData?.data?.role;

  const {
    data: myReportsData,
    isLoading: isMyReportsLoading,
    isError: isMyReportsError,
  } = useGetMyCustomerReports(role === "CUSTOMER");

  const {
    data: allReportsData,
    isLoading: isAllReportsLoading,
    isError: isAllReportsError,
  } = useGetAllCustomerReports(
    role === "POWER_OPERATOR" || role === "ZONE_MANAGER" || role === "ADMIN",
  );

  if (isUserLoading || !role) {
    return <PageLoader />;
  }

  if (role === "CUSTOMER") {
    return (
      <CustomerReports
        reports={myReportsData?.data ?? []}
        isLoading={isMyReportsLoading}
        isError={isMyReportsError}
      />
    );
  }

  if (
    role === "POWER_OPERATOR" ||
    role === "ZONE_MANAGER" ||
    role === "ADMIN"
  ) {
    return (
      <OperationalReports
        reports={allReportsData?.data ?? []}
        isLoading={isAllReportsLoading}
        isError={isAllReportsError}
        role={role}
      />
    );
  }

   return (
    <div className="rounded-xl border bg-background p-8 text-center">
      <AlertTriangle className="mx-auto size-8 text-muted-foreground" />

      <h2 className="mt-3 font-semibold">
        Reports are not available
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        You do not have permission to access customer reports.
      </p>
    </div>
  );
}