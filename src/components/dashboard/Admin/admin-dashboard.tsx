
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  MapPinned,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { PageLoader } from "@/components/shared/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetAdminAnalyticsData,
  useGetAllZones,
} from "@/hooks";

export default function AdminDashboard() {
  const {
    data: zonesData,
    isLoading: zonesLoading,
    isError: zonesError,
    refetch: refetchZones,
    isFetching: zonesFetching,
  } = useGetAllZones();

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    isError: analyticsError,
    refetch: refetchAnalytics,
    isFetching: analyticsFetching,
  } = useGetAdminAnalyticsData();

  const zones = zonesData?.data ?? [];
  const analytics = analyticsData?.data;

  const activeZones = zones.filter((zone) => zone.isActive);
  const inactiveZones = zones.filter((zone) => !zone.isActive);

  if (zonesLoading || analyticsLoading) {
    return <PageLoader />;
  }

  if (zonesError || analyticsError || !analytics) {
    return (
      <div className="space-y-6">
        <DashboardHeader />

        <section className="rounded-xl border border-destructive/30 bg-card p-6">
          <div className="flex size-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <Activity className="size-5" />
          </div>

          <h2 className="mt-4 font-semibold">
            Unable to load dashboard
          </h2>

          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            We couldn't retrieve all the dashboard information.
            Check your connection and try again.
          </p>

          <Button
            className="mt-4"
            variant="outline"
            disabled={zonesFetching || analyticsFetching}
            onClick={() => {
              void refetchZones();
              void refetchAnalytics();
            }}
          >
            Retry
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-6">
      {/* Header */}
      <DashboardHeader />

      {/* Welcome panel */}
      <section className="relative overflow-hidden rounded-2xl border bg-card">
        <div className="absolute -right-12 -top-20 size-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 right-40 size-48 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Activity className="size-3.5" />
              System overview
            </Badge>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Distribution at a glance
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Monitor your distribution infrastructure, manage
              system users, and keep essential operations organized
              from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/zones" />}
            >
              <MapPinned className="size-4" />
              Manage zones
              <ArrowRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard/users" />}
            >
              <Users className="size-4" />
              View users
            </Button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="space-y-4">
        <SectionHeading
          title="Key metrics"
          description="A summary of your distribution system."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Zones"
            value={zones.length}
            description="Registered distribution zones"
            icon={MapPinned}
          />

          <StatCard
            title="Active Zones"
            value={analytics.totalActiveZones}
            description="Currently active zones"
            icon={Activity}
          />

          <StatCard
            title="Inactive Zones"
            value={inactiveZones.length}
            description="Zones not currently active"
            icon={ShieldCheck}
          />

          <StatCard
            title="System Users"
            value={analytics.totalUsers}
            description="Registered user accounts"
            icon={Users}
          />
        </div>
      </section>

      {/* Infrastructure and quick actions */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Zones overview */}
        <section className="min-w-0 rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold tracking-tight">
                Distribution zones
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Overview of registered infrastructure zones.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/zones" />}
            >
              View all
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 border-b p-5">
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-blue-500" />
                Active
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {activeZones.length}
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-muted-foreground/50" />
                Inactive
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {inactiveZones.length}
              </p>
            </div>
          </div>

          {zones.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
                <Building2 className="size-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">
                No zones registered
              </h3>

              <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                Create your first distribution zone to get started.
              </p>

              <Button
                className="mt-4"
                nativeButton={false}
                render={<Link href="/dashboard/zones" />}
              >
                Manage zones
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {zones.slice(0, 5).map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30 sm:px-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                      <Building2 className="size-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {zone.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {zone.code}
                        {zone.description
                          ? ` · ${zone.description}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={zone.isActive ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {zone.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {zones.length > 5 && (
            <div className="border-t p-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/dashboard/zones" />}
              >
                View {zones.length - 5} more zones
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="rounded-xl border bg-card">
          <div className="border-b p-5">
            <h2 className="font-semibold tracking-tight">
              Quick actions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Shortcuts to common administration tasks.
            </p>
          </div>

          <div className="space-y-3 p-4">
            <QuickAction
              href="/dashboard/zones"
              title="Manage distribution zones"
              description="Review zone details and availability."
              icon={MapPinned}
            />

            <QuickAction
              href="/dashboard/users"
              title="Manage system users"
              description="Review registered accounts and roles."
              icon={Users}
            />

            <QuickAction
              href="/dashboard/settings"
              title="System settings"
              description="Review available system configuration."
              icon={ShieldCheck}
            />

            <div className="rounded-lg border border-dashed p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="size-4 text-primary" />
                Infrastructure health
              </div>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                {zones.length === 0
                  ? "No distribution zones have been registered yet."
                  : `${activeZones.length} of ${zones.length} registered zones are marked active.`}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer summary */}
      <div className="flex flex-col gap-2 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Load Shedding & Power Outage Management System</p>
        <p>Administration overview</p>
      </div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and monitor your electricity distribution system.
        </p>
      </div>

      <Badge variant="outline" className="w-fit gap-1.5 py-1.5">
        <span className="size-2 rounded-full bg-blue-500" />
        Administrator
      </Badge>
    </header>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
