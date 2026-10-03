"use client";

import { useState } from "react";
import { AlertTriangle, CalendarDays, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useCancelCustomerReport, useGetMe, useGetMyCustomerReports } from "@/hooks";
import { ICustomerReport } from "@/types/customer.type";

import { PageLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGetAllCustomerReports } from "@/hooks/report.hook";
import { getReportStatus } from "@/components/dashboard/reports/report-status";
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