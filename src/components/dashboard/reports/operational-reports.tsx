import { PageLoader } from "@/components/shared/page-loader";
import { ICustomerReport } from "@/types/customer.type";
import { PageHeader } from "./reports-page-header";
import { ReportStatCard } from "./report-stat-card";
import { EmptyReports, InfoItem, ReportsError, ReportStatusBadge } from "./reports-shared-component";
import { AlertTriangle, CalendarDays, CheckCircle2, FileText } from "lucide-react";
import { getReportStatus } from "./report-status";
import { IReport } from "@/types/customer-report.type";

export function OperationalReports({
  reports,
  isLoading,
  isError,
  role,
}: {
  reports: IReport[];
  isLoading: boolean;
  isError: boolean;
  role: "POWER_OPERATOR" | "ZONE_MANAGER";
}) {
  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return <ReportsError message="customer reports" />;
  }

  const pendingReports = reports.filter(
    (report) => report.status === "PENDING",
  );

  const linkedReports = reports.filter(
    (report) => report.status === "LINKED",
  );

  const cancelledReports = reports.filter(
    (report) => report.status === "CANCELLED",
  );

  const isZoneManager = role === "ZONE_MANAGER";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Reports"
        description={
          isZoneManager
            ? "Review customer-reported electricity problems in your assigned zone."
            : "Review customer-reported electricity problems in your assigned zones."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportStatCard
          title="Total Reports"
          value={reports.length}
          description={
            isZoneManager
              ? "Reports in your zone"
              : "Reports in your zones"
          }
          icon={FileText}
        />

        <ReportStatCard
          title="Pending"
          value={pendingReports.length}
          description="Awaiting review"
          icon={AlertTriangle}
        />

        <ReportStatCard
          title="Linked"
          value={linkedReports.length}
          description="Linked to outage incidents"
          icon={CheckCircle2}
        />

        <ReportStatCard
          title="Cancelled"
          value={cancelledReports.length}
          description="Cancelled reports"
          icon={CalendarDays}
        />
      </div>

      <section className="rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Customer Reports
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isZoneManager
              ? "Reports submitted by customers in your assigned zone."
              : "Reports submitted by customers in your assigned zones."}
          </p>
        </div>

        <div className="p-5">
          {reports.length === 0 ? (
            <EmptyReports
              title="No customer reports"
              description={
                isZoneManager
                  ? "There are currently no customer reports in your zone."
                  : "There are currently no customer reports in your assigned zones."
              }
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
                    <div className="flex flex-col gap-4">
                      {/* Customer + Status */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {report.customer?.user?.name ??
                              "Unknown Customer"}
                          </h3>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {report.customer?.user?.phone ||
                              "No phone number"}
                          </p>
                        </div>

                        <ReportStatusBadge
                          status={status}
                        />
                      </div>

                      {/* Description */}
                      <div className="rounded-lg bg-muted/40 p-4">
                        <p className="text-sm">
                          {report.description}
                        </p>
                      </div>

                      {/* Infrastructure */}
                      <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <InfoItem
                          label="Area"
                          value={
                            report.customer?.area?.name ??
                            "Unknown"
                          }
                        />

                        <InfoItem
                          label="Feeder"
                          value={
                            report.customer?.area?.feeder
                              ?.name ?? "Unknown"
                          }
                        />

                        <InfoItem
                          label="Substation"
                          value={
                            report.customer?.area?.feeder
                              ?.substation?.name ?? "Unknown"
                          }
                        />

                        <InfoItem
                          label="Zone"
                          value={
                            report.customer?.area?.feeder
                              ?.substation?.zone?.name ??
                            "Unknown"
                          }
                        />
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col gap-2 border-t pt-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <span>
                          Reported{" "}
                          {new Date(
                            report.reportedAt,
                          ).toLocaleString()}
                        </span>

                        <span>
                          {report.incidentId
                            ? "Incident linked"
                            : "No incident linked"}
                        </span>
                      </div>
                    </div>
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