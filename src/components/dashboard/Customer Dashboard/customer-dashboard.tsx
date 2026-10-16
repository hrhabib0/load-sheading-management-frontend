"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Plus,
  ShieldCheck,
  Zap,
  ZapOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useGetMe,
  useGetMyCustomerProfile,
  useGetMyCustomerReports,
  useGetMyAreaLoadShedding,
  useGetMyAreaOutageStatus,

} from "@/hooks";

// ---------- Safe display helpers ----------

function getRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function getText(
  value: unknown,
  keys: string[],
  fallback = "Not available",
): string {
  const record = getRecord(value);

  for (const key of keys) {
    const item = record[key];

    if (typeof item === "string" && item.trim()) {
      return item;
    }

    if (typeof item === "number") {
      return String(item);
    }
  }

  return fallback;
}

function getList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function formatDate(value: unknown): string {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value: unknown): string {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-BD", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const isPositive = [
    "RESTORED",
    "CLOSED",
    "COMPLETED",
    "APPROVED",
    "PUBLISHED",
    "ACTIVE",
  ].includes(normalized);

  const isNegative = [
    "FAILED",
    "REJECTED",
    "CANCELLED",
    "CANCELED",
  ].includes(normalized);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        isPositive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : isNegative
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-blue-200 bg-blue-50 text-blue-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof Zap;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-3 text-xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function CustomerDashboardPage() {
  const router = useRouter();

  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetMe();

  const user = userResponse?.data;

  const {
    data: customerProfileResponse,
    isLoading: isProfileLoading,
  } = useGetMyCustomerProfile();

  const {
    data: customerReportsResponse,
    isLoading: isReportsLoading,
  } = useGetMyCustomerReports();

  const {
    data: loadSheddingResponse,
    isLoading: isLoadSheddingLoading,
  } = useGetMyAreaLoadShedding();

  const {
    data: outageStatusResponse,
    isLoading: isOutageStatusLoading,
  } = useGetMyAreaOutageStatus();

  const customerProfile = customerProfileResponse?.data;
  const reports = getList(customerReportsResponse?.data);
  const schedules = getList(loadSheddingResponse?.data);
  const outageStatus = outageStatusResponse?.data;

  useEffect(() => {
    if (!isUserLoading && (isUserError || !user)) {
      router.replace("/login");
    }
  }, [isUserLoading, isUserError, user, router]);

  const isLoading =
    isUserLoading ||
    isProfileLoading ||
    isReportsLoading ||
    isLoadSheddingLoading ||
    isOutageStatusLoading;

  if (isLoading || isUserError || !user) {
    return (
      <main
        className="flex min-h-[60vh] items-center justify-center"
        aria-label="Loading customer dashboard"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="size-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your PowerGrid dashboard...
          </p>
        </div>
      </main>
    );
  }

  const displayName = getText(user, ["name", "fullName"], "Customer");
  const area = getRecord(customerProfile).area;
  const areaName = getText(area, ["name", "areaName"], "Your service area");

  const outageRecord = getRecord(outageStatus);
  const outageState = getText(
    outageRecord,
    ["status", "outageStatus", "state"],
    "UNKNOWN",
  );

  const outageDescription = getText(
    outageRecord,
    ["message", "description"],
    "Check the latest outage information for your area.",
  );

  const isRestored = [
    "RESTORED",
    "NO_OUTAGE",
    "NORMAL",
    "CLOSED",
  ].includes(outageState.toUpperCase());

  const upcomingSchedules = schedules
    .filter((item) => {
      const schedule = getRecord(item);
      const status = getText(schedule, ["status"], "").toUpperCase();

      return ![
        "CANCELLED",
        "CANCELED",
        "REJECTED",
        "COMPLETED",
      ].includes(status);
    })
    .slice(0, 4);

  const recentReports = reports.slice(0, 4);

  return (
    <main className="space-y-8 pb-10">
      {/* Welcome header */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="size-3.5" />
              PowerGrid Customer Portal
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome back, {displayName}!
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Keep track of power interruptions, planned load shedding, and
                your reported issues in one place.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              <span>{areaName}</span>
            </div>
          </div>

          <Button
            render={<Link href="/dashboard/reports/create" />}
            nativeButton={false}
            className="shrink-0"
          >
            <Plus className="size-4" />
            Report a Problem
          </Button>
        </div>
      </section>

      {/* Overview cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Service Area"
          value={areaName}
          description="Your registered electricity area"
          icon={MapPin}
        />

        <DashboardCard
          title="Outage Status"
          value={isRestored ? "Normal" : outageState.replaceAll("_", " ")}
          description={
            isRestored
              ? "No active outage indicated by the current status"
              : "Check the latest information below"
          }
          icon={isRestored ? CheckCircle2 : ZapOff}
        />

        <DashboardCard
          title="Load Shedding"
          value={upcomingSchedules.length}
          description="Schedule entries shown below"
          icon={CalendarClock}
        />

        <DashboardCard
          title="My Reports"
          value={reports.length}
          description="Reports returned by your account"
          icon={FileText}
        />
      </section>

      {/* Outage status */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`rounded-xl p-3 ${
                isRestored
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              {isRestored ? (
                <ShieldCheck className="size-6" />
              ) : (
                <AlertCircle className="size-6" />
              )}
            </div>

            <div>
              <h2 className="font-semibold tracking-tight">
                Power outage information
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Current information for {areaName}
              </p>
            </div>
          </div>

          <StatusBadge status={outageState} />
        </div>

        <div className="mt-5 rounded-xl bg-muted/50 p-4">
          <p className="text-sm leading-6 text-muted-foreground">
            {outageDescription}
          </p>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            render={<Link href="/dashboard/customer/outages" />}
            nativeButton={false}
          >
            View outage details
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* Schedules and reports */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b p-5">
            <div>
              <h2 className="font-semibold tracking-tight">
                Load-shedding schedule
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Schedule information for your area
              </p>
            </div>

            <CalendarClock className="size-5 text-primary" />
          </div>

          <div className="divide-y">
            {upcomingSchedules.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
                <p className="mt-3 font-medium">No schedules to display</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  There are no available schedule entries in the current
                  response.
                </p>
              </div>
            ) : (
              upcomingSchedules.map((item, index) => {
                const schedule = getRecord(item);
                const id = getText(schedule, ["id", "scheduleId"], `${index}`);
                const start = schedule.startTime ?? schedule.startAt;
                const end = schedule.endTime ?? schedule.endAt;

                return (
                  <div
                    key={id}
                    className="flex items-start gap-3 p-5 transition-colors hover:bg-muted/30"
                  >
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <Clock3 className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {formatDate(start)}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatTime(start) || "Start time unavailable"}
                        {formatTime(end) ? ` – ${formatTime(end)}` : ""}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {getText(
                          schedule,
                          ["title", "name", "description"],
                          "Scheduled power interruption",
                        )}
                      </p>
                    </div>

                    <StatusBadge
                      status={getText(schedule, ["status"], "SCHEDULED")}
                    />
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-between"
              render={<Link href="/dashboard/customer/load-shedding" />}
              nativeButton={false}
            >
              View all schedules
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b p-5">
            <div>
              <h2 className="font-semibold tracking-tight">My recent reports</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Track the issues you have reported
              </p>
            </div>

            <FileText className="size-5 text-primary" />
          </div>

          <div className="divide-y">
            {recentReports.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No reports yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Report a power problem to keep track of it here.
                </p>

                <Button
                  className="mt-4"
                  render={<Link href="/dashboard/customer/reports/new" />}
                  nativeButton={false}
                >
                  <Plus className="size-4" />
                  Create report
                </Button>
              </div>
            ) : (
              recentReports.map((item, index) => {
                const report = getRecord(item);
                const id = getText(report, ["id", "reportId"], `${index}`);

                return (
                  <div
                    key={id}
                    className="flex items-start gap-3 p-5 transition-colors hover:bg-muted/30"
                  >
                    <div className="rounded-lg bg-muted p-2.5 text-muted-foreground">
                      <FileText className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {getText(
                          report,
                          ["title", "subject", "description"],
                          "Power problem report",
                        )}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Submitted{" "}
                        {formatDate(report.createdAt ?? report.reportedAt)}
                      </p>

                      <div className="mt-2">
                        <StatusBadge
                          status={getText(report, ["status"], "PENDING")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-between"
              render={<Link href="/dashboard/reports" />}
              nativeButton={false}
            >
              View all reports
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Quick actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Common tasks for your electricity service
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/reports/create"
            className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <AlertCircle className="size-5" />
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 font-semibold">Report a power problem</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Tell the operations team about an unexpected interruption.
            </p>
          </Link>

          <Link
            href="/dashboard/customer/load-shedding"
            className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <CalendarClock className="size-5" />
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 font-semibold">Check load shedding</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Review the available schedule for your service area.
            </p>
          </Link>

          <Link
            href="/dashboard/notifications"
            className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Bell className="size-5" />
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 font-semibold">Notifications</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Check important updates about outages and service interruptions.
            </p>
          </Link>
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        PowerGrid · Your electricity service information in one place.
      </p>
    </main>
  );
}