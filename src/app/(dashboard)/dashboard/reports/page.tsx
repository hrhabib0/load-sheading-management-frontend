"use client";

import { useState } from "react";
import { AlertTriangle, CalendarDays, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useCancelCustomerReport, useGetMyCustomerReports } from "@/hooks";
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


const getReportStatus = (status: ICustomerReport["status"]) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Under Review",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      };

    case "LINKED":
      return {
        label: "Linked to Outage",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-muted text-muted-foreground",
      };

    default:
      return {
        label: status,
        className: "bg-muted text-muted-foreground",
      };
  }
};

export default function CustomerReportsPage() {
  const { data, isLoading, isError } = useGetMyCustomerReports();

  const queryClient = useQueryClient();

  const cancelReportMutation = useCancelCustomerReport();

  const [reportToCancel, setReportToCancel] = useState<string | null>(null);

  const reports = data?.data ?? [];

  const pendingReports = reports.filter(
    (report: any) => report.status === "PENDING",
  );

  const linkedReports = reports.filter(
    (report: any) => report.status === "LINKED",
  );

  const handleCancelReport = () => {
    if (!reportToCancel) return;

    cancelReportMutation.mutate(reportToCancel, {
      onSuccess: async () => {
        setReportToCancel(null);

        await queryClient.invalidateQueries({
          queryKey: ["my-customer-reports"],
        });
      },
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-destructive" />

          <div>
            <h2 className="font-semibold">Unable to load reports</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Something went wrong while retrieving your reports.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          My Reports
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View the power problems you have reported.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Reports */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Reports
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight">
                {reports.length}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <FileText className="size-5" />
            </div>
          </div>
        </div>

        {/* Under Review */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Under Review
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight">
                {pendingReports.length}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <AlertTriangle className="size-5" />
            </div>
          </div>
        </div>

        {/* Linked Reports */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Linked to Outage
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight">
                {linkedReports.length}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <CalendarDays className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">Report History</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your submitted power problem reports.
          </p>
        </div>

        <div className="p-5">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText className="size-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No reports yet</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                You haven&apos;t reported any power problems yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report: any) => {
                const status = getReportStatus(report.status);

                return (
                  <div
                    key={report.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium">
                          {report.description}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>
                            Reported{" "}
                            {new Date(report.reportedAt).toLocaleString()}
                          </span>

                          {report.linkedAt && (
                            <span>
                              Linked{" "}
                              {new Date(report.linkedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {report.incidentId && (
                      <div className="mt-4 border-t pt-3">
                        <p className="text-xs text-muted-foreground">
                          Outage Incident
                        </p>

                        <p className="mt-1 font-mono text-xs">
                          {report.incidentId}
                        </p>
                      </div>
                    )}

                    {/* Cancel Report */}
                    {report.status === "PENDING" && (
                      <div className="mt-4 flex justify-end border-t pt-3">
                        <AlertDialog
                          open={reportToCancel === report.id}
                          onOpenChange={(open:boolean) => {
                            if (!open) {
                              setReportToCancel(null);
                            }
                          }}
                        >
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReportToCancel(report.id)}
                              />
                            }
                          >
                            Cancel Report
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel this report?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                This will cancel your power problem report.
                                You can submit a new report later if needed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel
                                disabled={cancelReportMutation.isPending}
                              >
                                Keep Report
                              </AlertDialogCancel>

                              <AlertDialogAction
                                disabled={cancelReportMutation.isPending}
                                onClick={handleCancelReport}
                              >
                                {cancelReportMutation.isPending
                                  ? "Cancelling..."
                                  : "Yes, Cancel Report"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}