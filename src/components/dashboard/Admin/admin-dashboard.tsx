
"use client";

import Link from "next/link";
import {
  Activity,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { PageLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { useGetAllZones } from "@/hooks";

export default function AdminDashboard() {
  const {
    data: zonesData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllZones();

  const zones = zonesData?.data ?? [];

  const activeZones = zones.filter((zone) => zone.isActive);
  const inactiveZones = zones.filter((zone) => !zone.isActive);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor the electricity distribution system.
          </p>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load dashboard data
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't retrieve the distribution zones.
            Please try again.
          </p>

          <Button
            className="mt-4"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor the electricity distribution system.
          </p>
        </div>

        <Button render={<Link href="/dashboard/zones" />}>
          <MapPinned />
          Manage Zones
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Zones"
          value={zones.length}
          description="Registered distribution zones"
          icon={MapPinned}
        />

        <StatCard
          title="Active Zones"
          value={activeZones.length}
          description="Currently active zones"
          icon={Activity}
        />

        <StatCard
          title="Inactive Zones"
          value={inactiveZones.length}
          description="Deactivated zones"
          icon={ShieldCheck}
        />

        <StatCard
          title="System Users"
          value="—"
          description="Available after user-list API"
          icon={Users}
        />
      </div>

      {/* Zones */}
      <section className="rounded-xl border bg-background shadow-sm">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Distribution Zones</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Overview of registered distribution zones.
            </p>
          </div>

          <Button
            variant="outline"
            render={<Link href="/dashboard/zones" />}
          >
            View All Zones
          </Button>
        </div>

        {zones.length === 0 ? (
          <div className="p-10 text-center">
            <MapPinned className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-3 font-semibold">No zones found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a distribution zone to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {zones.slice(0, 5).map((zone) => (
              <div
                key={zone.id}
                className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-medium">{zone.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {zone.code}
                    {zone.description ? ` · ${zone.description}` : ""}
                  </p>
                </div>

                <span
                  className={
                    zone.isActive
                      ? "w-fit rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600"
                      : "w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  }
                >
                  {zone.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}