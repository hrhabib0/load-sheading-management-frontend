"use client";

import { PageLoader } from "@/components/shared/page-loader";
import { useGetAllOutageIncidents, useGetAllPlannedOutages } from "@/hooks/outage.hook";
import {
  AlertTriangle,
  CalendarClock,
  Zap,
} from "lucide-react";
import { StatCard } from "../stat-card";
import { useGetAllCustomerReports } from "@/hooks/report.hook";


export function PowerOperatorDashboard() {
  const {
    data: incidentsData,
    isLoading: isIncidentsLoading,
  } = useGetAllOutageIncidents();

  const {
    data: plannedOutagesData,
    isLoading: isPlannedOutagesLoading,
  } = useGetAllPlannedOutages();

  const incidents = incidentsData?.data ?? [];
  const plannedOutages = plannedOutagesData?.data ?? [];

  const activeOutages = incidents.filter((incident) =>
    [
      "INVESTIGATING",
      "REPAIRING",
      "RESTORATION_PENDING",
    ].includes(incident.status),
  );

  const activePlannedOutages = plannedOutages.filter(
    (outage) => outage.status === "IN_PROGRESS",
  );

  const upcomingPlannedOutages = plannedOutages.filter(
    (outage) =>
      ["APPROVED", "PUBLISHED"].includes(outage.status) &&
      new Date(outage.scheduledStartAt) > new Date(),
  );

  const {
  data: reportsData,
  isLoading: isReportsLoading,
} = useGetAllCustomerReports();

const reports = reportsData?.data ?? [];

const pendingReports = reports.filter(
  (report) => report.status === "PENDING",
);

const isLoading = isIncidentsLoading || isPlannedOutagesLoading || isReportsLoading;

  if (isLoading) {
    return (
      <PageLoader />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Power Operator Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor and manage electricity operations across your assigned zones.
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
          title="Planned Outages"
          value={activePlannedOutages.length}
          description="Currently in progress"
          icon={CalendarClock}
        />

        <StatCard
          title="Upcoming Outages"
          value={upcomingPlannedOutages.length}
          description="Approved or published"
          icon={CalendarClock}
        />

        <StatCard
            title="Pending Reports"
            value={pendingReports.length}
            description="Customer reports awaiting review"
            icon={AlertTriangle}
        />
      </div>

      {/* Recent Outage */}
      <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold">
                Pending Customer Reports
                </h2>

                <p className="text-sm text-muted-foreground">
                Customer-reported problems awaiting operational review.
                </p>
            </div>

            {pendingReports.length === 0 ? (
                <div className="rounded-xl border bg-background p-8 text-center">
                <AlertTriangle className="mx-auto size-8 text-muted-foreground" />

                <h3 className="mt-3 font-semibold">
                    No pending reports
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    There are currently no customer reports awaiting review.
                </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pendingReports.slice(0, 5).map((report) => (
                        <div
                            key={report.id}
                            className="rounded-xl border bg-background p-5"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="font-semibold">
                                        {report.customer.user.name}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                        {report.customer.area.name}
                                        </p>
                                    </div>

                                    <p className="text-sm">
                                        {report.description}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {report.customer.area.feeder.name} ·{" "}
                                        {report.customer.area.feeder.substation.name} ·{" "}
                                        {report.customer.area.feeder.substation.zone.name}
                                    </p>
                                </div>

                                <span className="w-fit rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-600">
                                    Pending
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
      </section>

      {/* Active outages */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Active Outages
          </h2>

          <p className="text-sm text-muted-foreground">
            Outages currently requiring operational attention.
          </p>
        </div>

        {activeOutages.length === 0 ? (
          <div className="rounded-xl border bg-background p-8 text-center">
            <Zap className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-3 font-semibold">
              No active outages
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no active outages in your assigned zones.
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
                      {incident.feeder.substation.name} ·{" "}
                      {incident.feeder.substation.zone.name}
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
    </div>
  );
}