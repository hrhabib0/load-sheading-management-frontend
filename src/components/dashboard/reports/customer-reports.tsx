import { PageLoader } from "@/components/shared/page-loader";
import { useCancelCustomerReport } from "@/hooks";
import { ICustomerReport } from "@/types/customer.type";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "./reports-page-header";
import { ReportStatCard } from "./report-stat-card";
import { AlertTriangle, CalendarDays, FileText } from "lucide-react";
import { EmptyReports, ReportsError, ReportStatusBadge } from "./reports-shared-component";
import { getReportStatus } from "./report-status";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function CustomerReports({
  reports,
  isLoading,
  isError,
}: {
  reports: ICustomerReport[];
  isLoading: boolean;
  isError: boolean;
}) {
  const queryClient = useQueryClient();

  const cancelReportMutation = useCancelCustomerReport();

  const [reportToCancel, setReportToCancel] =
    useState<string | null>(null);

  const pendingReports = reports.filter(
    (report) => report.status === "PENDING",
  );

  const linkedReports = reports.filter(
    (report) => report.status === "LINKED",
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
    return <ReportsError message="your reports" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Reports"
        description="View the power problems you have reported."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ReportStatCard
          title="Total Reports"
          value={reports.length}
          icon={FileText}
        />

        <ReportStatCard
          title="Under Review"
          value={pendingReports.length}
          icon={AlertTriangle}
        />

        <ReportStatCard
          title="Linked to Outage"
          value={linkedReports.length}
          icon={CalendarDays}
        />
      </div>

      <section className="rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Report History
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your submitted power problem reports.
          </p>
        </div>

        <div className="p-5">
          {reports.length === 0 ? (
            <EmptyReports
              title="No reports yet"
              description="You haven't reported any power problems yet."
            />
          ) : (
            <div className="space-y-4">
              {reports.map((report) => {
                const status = getReportStatus(
                  report.status,
                );

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
                            {new Date(
                              report.reportedAt,
                            ).toLocaleString()}
                          </span>

                          {report.linkedAt && (
                            <span>
                              Linked{" "}
                              {new Date(
                                report.linkedAt,
                              ).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <ReportStatusBadge
                        status={status}
                      />
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

                    {report.status === "PENDING" && (
                      <div className="mt-4 flex justify-end border-t pt-3">
                        <AlertDialog
                          open={
                            reportToCancel === report.id
                          }
                          onOpenChange={(open) => {
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
                                onClick={() =>
                                  setReportToCancel(
                                    report.id,
                                  )
                                }
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
                                This will cancel your power
                                problem report. You can
                                submit a new report later if
                                needed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel
                                disabled={
                                  cancelReportMutation.isPending
                                }
                              >
                                Keep Report
                              </AlertDialogCancel>

                              <AlertDialogAction
                                disabled={
                                  cancelReportMutation.isPending
                                }
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
      </section>
    </div>
  );
}