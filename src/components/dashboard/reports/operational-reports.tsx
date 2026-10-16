
"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Link2,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageLoader } from "@/components/shared/page-loader";
import { IReport } from "@/types/customer-report.type";

import { PageHeader } from "./reports-page-header";
import { ReportStatCard } from "./report-stat-card";
import {
  EmptyReports,
  InfoItem,
  ReportsError,
  ReportStatusBadge,
} from "./reports-shared-component";
import { getReportStatus } from "./report-status";
import { useLinkCustomerReport } from "@/hooks";
import { toast } from "@/components/ui/toast";

type OperationalRole = "ADMIN" | "POWER_OPERATOR" | "ZONE_MANAGER";
type ReportFilter = "ALL" | "PENDING" | "LINKED" | "CANCELLED";

interface OperationalReportsProps {
  reports: IReport[];
  isLoading: boolean;
  isError: boolean;
  role: OperationalRole;
}

function formatDate(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getScopeLabel(role: OperationalRole) {
  if (role === "ADMIN") return "across the entire system";
  if (role === "ZONE_MANAGER") return "within your assigned zone";
  return "within your assigned zones";
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CU"
  );
}

export function OperationalReports({
  reports,
  isLoading,
  isError,
  role,
}: OperationalReportsProps) {
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReportFilter>("ALL");
  const [incidentId, setIncidentId] = useState("");

  const { mutate: linkReport, isPending: isLinkingReport } = useLinkCustomerReport();

  const pendingReports = reports.filter(
    (report) => report.status === "PENDING",
  );

  const linkedReports = reports.filter(
    (report) => report.status === "LINKED",
  );

  const cancelledReports = reports.filter(
    (report) => report.status === "CANCELLED",
  );

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesStatus =
        filter === "ALL" || report.status === filter;

      const customerName = report.customer?.user?.name ?? "";
      const areaName = report.customer?.area?.name ?? "";
      const feederName = report.customer?.area?.feeder?.name ?? "";
      const description = report.description ?? "";
      const reportId = report.id ?? "";

      const searchableText = [
        customerName,
        areaName,
        feederName,
        description,
        reportId,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [reports, search, filter]);

  if (isLoading) return <PageLoader />;

  if (isError) {
    return <ReportsError message="customer reports" />;
  }

  const isAdmin = role === "ADMIN";
  const isZoneManager = role === "ZONE_MANAGER";

  const closeReview = () => {
    setSelectedReport(null);
    setIncidentId("");
  };

  const handleLinkReport = () => {
    if (!selectedReport) return;

    const normalizedIncidentId = incidentId.trim();

     if (!normalizedIncidentId) {
      toast.add({
        title: "Incident ID required",
        description: "Enter an outage incident ID.",
        type: "error",
      });
      return;
    }

    if (selectedReport.status !== "PENDING") {
      toast.add({
        title: "Cannot link report",
        description: "Only pending reports can be linked.",
        type: "error",
      });
      return;
    }

    if (selectedReport.incidentId) {
      toast.add({
        title: "Report already linked",
        description: "This report is already linked to an incident.",
        type: "error",
      });
      return;
    }

    linkReport(
      {
        incidentId: normalizedIncidentId,
        payload: {
          reportId: selectedReport.id,
        },
      },
      {
        onSuccess: (response:any) => {
          toast.add({
            title: "Report linked",
            description:
              response.message || "Customer report linked successfully.",
            type: "success",
          });
          closeReview();
        },
        onError: (error:any) => {
          toast.add({
            title: "Failed to link report",
            description: error.message || "Please try again.",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        title="Customer Reports"
        description={`Review customer-reported electricity problems ${getScopeLabel(role)}.`}
      />

      {/* Overview */}
      <section
        aria-label="Report statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <ReportStatCard
          title="Total reports"
          value={reports.length}
          description="Reports in your current scope"
          icon={FileText}
        />

        <ReportStatCard
          title="Pending review"
          value={pendingReports.length}
          description="Awaiting operational action"
          icon={AlertTriangle}
        />

        <ReportStatCard
          title="Linked to incidents"
          value={linkedReports.length}
          description="Associated with outage incidents"
          icon={CheckCircle2}
        />

        <ReportStatCard
          title="Cancelled"
          value={cancelledReports.length}
          description="Cancelled by customers"
          icon={AlertCircle}
        />
      </section>

      {/* Main report panel */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Report submissions
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Review, investigate, and link reports to outage incidents.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              {isAdmin
                ? "System-wide access"
                : isZoneManager
                  ? "Assigned zone"
                  : "Assigned zones"}
            </div>
          </div>

          {/* Search and filter */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer, area, feeder, or description..."
                aria-label="Search customer reports"
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["ALL", "All reports"],
                  ["PENDING", "Pending"],
                  ["LINKED", "Linked"],
                  ["CANCELLED", "Cancelled"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={filter === value ? "default" : "outline"}
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                >
                  {label}
                  <span className="ml-1 rounded-full bg-background/20 px-1.5 text-xs">
                    {
                      {
                        ALL: reports.length,
                        PENDING: pendingReports.length,
                        LINKED: linkedReports.length,
                        CANCELLED: cancelledReports.length,
                      }[value]
                    }
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Report list */}
        <div className="space-y-4 p-4 sm:p-6">
          {filteredReports.length === 0 ? (
            search || filter !== "ALL" ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-5 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Search className="size-5 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">No matching reports</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try a different search term or change the status filter.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setFilter("ALL");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <EmptyReports
                title="No customer reports yet"
                description={`There are no customer reports available ${getScopeLabel(role)}.`}
              />
            )
          ) : (
            filteredReports.map((report) => {
              const customerName =
                report.customer?.user?.name ?? "Unknown customer";

              const area = report.customer?.area;
              const feeder = area?.feeder;
              const substation = feeder?.substation;
              const zone = substation?.zone;

              const canLink =
                report.status === "PENDING" && !report.incidentId;

              return (
                <article
                  key={report.id}
                  className="overflow-hidden rounded-xl border bg-background transition-colors hover:border-primary/30"
                >
                  <div className="space-y-5 p-4 sm:p-5">
                    {/* Customer and status */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                          {getInitials(customerName)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold tracking-tight">
                            {customerName}
                          </h3>

                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <Phone className="size-3.5" />
                              {report.customer?.user?.phone ||
                                "No phone number"}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 className="size-3.5" />
                              {formatDate(report.reportedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <ReportStatusBadge
                          status={getReportStatus(report.status)}
                        />
                        <span className="font-mono text-xs text-muted-foreground">
                          #{report.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="rounded-xl bg-muted/40 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Problem description
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {report.description}
                      </p>
                    </div>

                    {/* Infrastructure */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        <h4 className="text-sm font-semibold">
                          Affected infrastructure
                        </h4>
                      </div>

                      <div className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2 xl:grid-cols-4">
                        <InfoItem
                          label="Zone"
                          value={zone?.name ?? "Unknown"}
                        />
                        <InfoItem
                          label="Substation"
                          value={substation?.name ?? "Unknown"}
                        />
                        <InfoItem
                          label="Feeder"
                          value={feeder?.name ?? "Unknown"}
                        />
                        <InfoItem
                          label="Area"
                          value={area?.name ?? "Unknown"}
                        />
                      </div>
                    </div>

                    {/* Incident relationship and actions */}
                    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-2 text-sm">
                        {report.incidentId ? (
                          <>
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                            <div>
                              <p className="font-medium">Incident linked</p>
                              <p className="mt-0.5 break-all text-xs text-muted-foreground">
                                {report.incidentId}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Zap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                No incident linked
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {canLink
                                  ? "Ready for operational review"
                                  : "This report cannot currently be linked"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant={canLink ? "default" : "outline"}
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setSelectedReport(report);
                          setIncidentId("");
                        }}
                      >
                        <Eye className="size-4" />
                        Review report
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {filteredReports.length > 0 && (
          <div className="border-t bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        )}
      </section>

      {/* Review and link dialog */}
      <Dialog
        open={selectedReport !== null}
        onOpenChange={(open) => {
          if (!open && !isLinkingReport) {
            closeReview();
          }
        }}
      >
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Review customer report
                </DialogTitle>
                <DialogDescription>
                  Check the report and its infrastructure before linking it to
                  an existing outage incident.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Report overview */}
                <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {getInitials(
                        selectedReport.customer?.user?.name ??
                          "Unknown customer",
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {selectedReport.customer?.user?.name ??
                          "Unknown customer"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedReport.customer?.user?.phone ||
                          "No phone number"}
                      </p>
                    </div>
                  </div>

                  <ReportStatusBadge
                    status={getReportStatus(selectedReport.status)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">
                    Problem description
                  </h3>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {selectedReport.description}
                    </p>
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">
                    Infrastructure details
                  </h3>

                  <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
                    <InfoItem
                      label="Zone"
                      value={
                        selectedReport.customer?.area?.feeder?.substation
                          ?.zone?.name ?? "Unknown"
                      }
                    />
                    <InfoItem
                      label="Substation"
                      value={
                        selectedReport.customer?.area?.feeder?.substation
                          ?.name ?? "Unknown"
                      }
                    />
                    <InfoItem
                      label="Feeder"
                      value={
                        selectedReport.customer?.area?.feeder?.name ??
                        "Unknown"
                      }
                    />
                    <InfoItem
                      label="Area"
                      value={
                        selectedReport.customer?.area?.name ?? "Unknown"
                      }
                    />
                  </div>
                </div>

                {/* Submission metadata */}
                <div className="rounded-xl border p-4">
                  <InfoItem
                    label="Reported at"
                    value={formatDate(selectedReport.reportedAt)}
                  />

                  <div className="mt-4">
                    <InfoItem
                      label="Report ID"
                      value={selectedReport.id}
                    />
                  </div>

                  {selectedReport.incidentId && (
                    <div className="mt-4">
                      <InfoItem
                        label="Linked incident"
                        value={selectedReport.incidentId}
                      />
                    </div>
                  )}
                </div>

                {/* Link existing incident */}
                {selectedReport.status === "PENDING" &&
                !selectedReport.incidentId ? (
                  <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/3 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Link2 className="size-4" />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          Link to an outage incident
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          Enter the ID of an existing eligible incident. The
                          server will validate its status, feeder, and your
                          permissions.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="incident-id"
                        className="text-sm font-medium"
                      >
                        Outage incident ID
                      </label>

                      <Input
                        id="incident-id"
                        value={incidentId}
                        onChange={(event) =>
                          setIncidentId(event.target.value)
                        }
                        placeholder="Paste the incident UUID"
                        disabled={isLinkingReport}
                        autoComplete="off"
                      />
                    </div>

                    <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      Linking will associate this report with the incident. It
                      does not create a new incident.
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeReview}
                        disabled={isLinkingReport}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        onClick={handleLinkReport}
                        disabled={
                          isLinkingReport || !incidentId.trim()
                        }
                      >
                        <Link2 className="size-4" />
                        {isLinkingReport ? "Linking report..." : "Link report"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      {selectedReport.incidentId ? (
                        <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="mt-0.5 size-5 text-muted-foreground" />
                      )}

                      <div>
                        <p className="font-medium">
                          {selectedReport.incidentId
                            ? "This report is already linked"
                            : "Linking is unavailable"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedReport.incidentId
                            ? "Review the incident association above."
                            : "Only pending reports that are not already linked can be linked to an incident."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeReview}
                      >
                        Close review
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}