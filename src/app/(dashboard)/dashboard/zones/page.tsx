
"use client";

import { useMemo, useState } from "react";
import {
  MapPinned,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { useGetAllZones } from "@/hooks";
import type { IZone } from "@/types/zone.type";
import { PageLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ZoneStatus = "ALL" | "ACTIVE" | "INACTIVE";

function ZoneStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={
        isActive
          ? "inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600"
          : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
      }
    >
      <span
        className={
          isActive
            ? "size-1.5 rounded-full bg-green-500"
            : "size-1.5 rounded-full bg-muted-foreground"
        }
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export default function AdminZonesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ZoneStatus>("ALL");

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllZones();

  const zones = response?.data ?? [];

  const activeCount = zones.filter((zone) => zone.isActive).length;
  const inactiveCount = zones.length - activeCount;

  const filteredZones = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return zones.filter((zone: IZone) => {
      const matchesSearch =
        !normalizedSearch ||
        zone.name.toLowerCase().includes(normalizedSearch) ||
        zone.code.toLowerCase().includes(normalizedSearch) ||
        (zone.description ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && zone.isActive) ||
        (status === "INACTIVE" && !zone.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [zones, search, status]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError && !response) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Distribution Zones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor distribution zones.
          </p>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load zones
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Distribution Zones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage the zones in your electricity distribution system.
          </p>
        </div>

        {/* Add Zone button will be connected when create-zone functionality is ready. */}
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Zones
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {zones.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Registered distribution zones
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <MapPinned className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Zones
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {activeCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Currently active
              </p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-2.5 text-green-600">
              <ShieldCheck className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Inactive Zones
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {inactiveCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Currently deactivated
              </p>
            </div>
            <div className="rounded-lg bg-muted p-2.5 text-muted-foreground">
              <MapPinned className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Zone Table */}
      <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="space-y-4 border-b p-5">
          <div>
            <h2 className="font-semibold">All Zones</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search zones by name, code, or description.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search zones..."
                aria-label="Search zones"
                className="pl-9"
              />
            </div>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ZoneStatus)
              }
              aria-label="Filter zones by status"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!search && status === "ALL"}
            >
              <X />
              Clear
            </Button>
          </div>
        </div>

        {filteredZones.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <MapPinned className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-3 font-semibold">No zones found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    Zone
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    Code
                  </th>
                  <th className="min-w-56 px-5 py-3 font-medium">
                    Description
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredZones.map((zone) => (
                  <tr
                    key={zone.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {zone.name}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                        {zone.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {zone.description || "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <ZoneStatusBadge isActive={zone.isActive} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {formatDate(zone.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t px-5 py-3 text-sm text-muted-foreground">
          Showing {filteredZones.length} of {zones.length} zones
        </div>
      </section>
    </div>
  );
}