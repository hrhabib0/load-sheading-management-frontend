"use client";

import { useGetAllOutageIncidents, useGetAllPlannedOutages } from "@/hooks/outage.hook";
import { useGetAllCustomerReports } from "@/hooks/report.hook";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { StatCard } from "../stat-card";


export function ZoneManagerDashboard() {
  const {
    data: incidentsData,
    isLoading: isIncidentsLoading,
  } = useGetAllOutageIncidents();

  const {
    data: reportsData,
    isLoading: isReportsLoading,
  } = useGetAllCustomerReports();

  const {
    data: plannedOutagesData,
    isLoading: isPlannedOutagesLoading,
  } = useGetAllPlannedOutages();

  const incidents = incidentsData?.data ?? [];
  const reports = reportsData?.data ?? [];
  const plannedOutages = plannedOutagesData?.data ?? [];

  const activeOutages = incidents.filter((incident) =>
    [
      "INVESTIGATING",
      "REPAIRING",
      "RESTORATION_PENDING",
    ].includes(incident.status),
  );

  const pendingReports = reports.filter(
    (report) => report.status === "PENDING",
  );

  const activePlannedOutages = plannedOutages.filter(
    (outage) => outage.status === "IN_PROGRESS",
  );

  const pendingApprovals = plannedOutages.filter(
    (outage) => outage.status === "PENDING_APPROVAL",
  );

  const restorationPending = incidents.filter(
    (incident) => incident.status === "RESTORATION_PENDING",
  );

  const isLoading =
    isIncidentsLoading ||
    isReportsLoading ||
    isPlannedOutagesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

          <p className="text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Zone Manager Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor and supervise electricity operations in your assigned zone.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Outages"
          value={activeOutages.length}
          description="Currently affecting service"
          icon={Zap}
        />

        <StatCard
          title="Pending Reports"
          value={pendingReports.length}
          description="Customer reports awaiting review"
          icon={AlertTriangle}
        />

        <StatCard
          title="Planned Outages"
          value={activePlannedOutages.length}
          description="Currently in progress"
          icon={CalendarClock}
        />

        <StatCard
          title="Restoration Pending"
          value={restorationPending.length}
          description="Waiting for restoration verification"
          icon={CheckCircle2}
        />
      </div>

      {/* Operational overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active outages */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Active Outages
            </h2>

            <p className="text-sm text-muted-foreground">
              Outages currently requiring attention.
            </p>
          </div>

          {activeOutages.length === 0 ? (
            <div className="rounded-xl border bg-background p-8 text-center">
              <Zap className="mx-auto size-8 text-muted-foreground" />

              <h3 className="mt-3 font-semibold">
                No active outages
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                There are currently no active outages in your zone.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOutages.slice(0, 5).map((incident) => (
                <div
                  key={incident.id}
                  className="rounded-xl border bg-background p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {incident.feeder.name}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {incident.feeder.substation.name}
                      </p>

                      {incident.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {incident.description}
                        </p>
                      )}
                    </div>

                    <span className="w-fit rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                      {incident.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pending reports */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Pending Customer Reports
            </h2>

            <p className="text-sm text-muted-foreground">
              Reports awaiting operational review.
            </p>
          </div>

          {pendingReports.length === 0 ? (
            <div className="rounded-xl border bg-background p-8 text-center">
              <AlertTriangle className="mx-auto size-8 text-muted-foreground" />

              <h3 className="mt-3 font-semibold">
                No pending reports
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                All customer reports have been reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border bg-background p-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">
                          {report.customer.user.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {report.customer.area.name}
                        </p>
                      </div>

                      <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-600">
                        Pending
                      </span>
                    </div>

                    <p className="text-sm">
                      {report.description}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {report.customer.area.feeder.name} ·{" "}
                      {report.customer.area.feeder.substation.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Planned outage approvals */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Planned Outage Approvals
          </h2>

          <p className="text-sm text-muted-foreground">
            Planned outages waiting for your review.
          </p>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="rounded-xl border bg-background p-8 text-center">
            <CalendarClock className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-3 font-semibold">
              No pending approvals
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              There are no planned outages waiting for approval.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingApprovals.slice(0, 4).map((outage) => (
              <div
                key={outage.id}
                className="rounded-xl border bg-background p-5"
              >
                <h3 className="font-semibold">
                  {outage.title}
                </h3>

                {outage.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {outage.description}
                  </p>
                )}

                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <p>
                    Created by: {outage.creator.name}
                  </p>

                  <p>
                    Feeders affected: {outage.feeders.length}
                  </p>

                  <p>
                    Scheduled:{" "}
                    {new Date(
                      outage.scheduledStartAt,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}