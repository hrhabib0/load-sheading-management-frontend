"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  MapPin,
  Search,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OutageStatus =
  | "INVESTIGATING"
  | "REPAIRING"
  | "RESTORATION_PENDING"
  | "RESTORED"
  | "CLOSED";

type Outage = {
  id: string;
  incidentNumber: string;
  title: string;
  zone: string;
  feeder: string;
  affectedAreas: string[];
  status: OutageStatus;
  reportedAt: string;
  estimatedRestoration: string | null;
};

const demoOutages: Outage[] = [
  {
    id: "1",
    incidentNumber: "OUT-2026-001",
    title: "Unexpected power interruption",
    zone: "Dhaka South",
    feeder: "Feeder-01",
    affectedAreas: ["Dhanmondi", "Kalabagan"],
    status: "INVESTIGATING",
    reportedAt: "2026-10-10T09:30:00",
    estimatedRestoration: "2026-10-10T23:30:00",
  },
  {
    id: "2",
    incidentNumber: "OUT-2026-002",
    title: "Distribution line fault",
    zone: "Dhaka North",
    feeder: "Feeder-03",
    affectedAreas: ["Uttara Sector 4", "Uttara Sector 5"],
    status: "REPAIRING",
    reportedAt: "2026-10-10T08:15:00",
    estimatedRestoration: "2026-10-10T23:00:00",
  },
  {
    id: "3",
    incidentNumber: "OUT-2026-003",
    title: "Power restoration verification",
    zone: "Dhaka South",
    feeder: "Feeder-02",
    affectedAreas: ["Mohammadpur"],
    status: "RESTORATION_PENDING",
    reportedAt: "2026-10-10T06:45:00",
    estimatedRestoration: null,
  },
  {
    id: "4",
    incidentNumber: "OUT-2026-004",
    title: "Transformer fault repaired",
    zone: "Dhaka North",
    feeder: "Feeder-01",
    affectedAreas: ["Mirpur Section 10"],
    status: "RESTORED",
    reportedAt: "2026-10-09T20:10:00",
    estimatedRestoration: null,
  },
  {
    id: "5",
    incidentNumber: "OUT-2026-005",
    title: "Cable fault resolved",
    zone: "Dhaka South",
    feeder: "Feeder-04",
    affectedAreas: ["Lalbagh"],
    status: "CLOSED",
    reportedAt: "2026-10-09T15:00:00",
    estimatedRestoration: null,
  },
];

type StatusFilter = "ALL" | "ACTIVE" | "RESTORED" | "CLOSED";

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function getStatusVariant(status: OutageStatus) {
  switch (status) {
    case "INVESTIGATING":
      return "outline";
    case "REPAIRING":
      return "destructive";
    case "RESTORATION_PENDING":
      return "secondary";
    case "RESTORED":
      return "default";
    case "CLOSED":
      return "outline";
  }
}

function isActive(status: OutageStatus) {
  return !["RESTORED", "CLOSED"].includes(status);
}

export default function OutagesDemoPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const activeCount = demoOutages.filter((outage) =>
    isActive(outage.status),
  ).length;

  const filteredOutages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return demoOutages.filter((outage) => {
      const matchesSearch =
        !query ||
        [
          outage.incidentNumber,
          outage.title,
          outage.zone,
          outage.feeder,
          ...outage.affectedAreas,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive(outage.status)) ||
        outage.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Power Outages
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor outage incidents and restoration progress.
          </p>
        </div>

        <Badge variant="outline">Demo data</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Outages"
          value={demoOutages.length}
          icon={<Zap className="size-5" />}
        />
        <Stat
          label="Active Outages"
          value={activeCount}
          icon={<AlertTriangle className="size-5" />}
        />
        <Stat
          label="Restored"
          value={
            demoOutages.filter((o) => o.status === "RESTORED").length
          }
          icon={<Zap className="size-5" />}
        />
        <Stat
          label="Closed"
          value={
            demoOutages.filter((o) => o.status === "CLOSED").length
          }
          icon={<CalendarClock className="size-5" />}
        />
      </div>

      <section className="space-y-4 rounded-xl border bg-card p-4 md:p-5">
        <div>
          <h2 className="font-semibold">Outage Incidents</h2>
          <p className="text-sm text-muted-foreground">
            Search incidents by number, zone, feeder, or area.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search outages..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              ["ALL", "ACTIVE", "RESTORED", "CLOSED"] as const
            ).map((filter) => (
              <Button
                key={filter}
                variant={statusFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter)}
              >
                {filter === "ALL"
                  ? "All"
                  : filter === "ACTIVE"
                    ? "Active"
                    : filter === "RESTORED"
                      ? "Restored"
                      : "Closed"}
              </Button>
            ))}
          </div>
        </div>

        {filteredOutages.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="font-medium">No outages found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search term or status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOutages.map((outage) => (
              <article
                key={outage.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        {outage.incidentNumber}
                      </span>
                      <Badge variant={getStatusVariant(outage.status)}>
                        {outage.status.replaceAll("_", " ")}
                      </Badge>
                    </div>

                    <p className="font-medium">{outage.title}</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-4" />
                        {outage.zone}
                      </span>
                      <span>{outage.feeder}</span>
                    </div>

                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        Affected areas:{" "}
                      </span>
                      {outage.affectedAreas.join(", ")}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Reported: {formatDate(outage.reportedAt)}
                    </p>

                    {outage.estimatedRestoration && (
                      <p className="text-xs text-muted-foreground">
                        Estimated restoration:{" "}
                        {formatDate(outage.estimatedRestoration)}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Showing {filteredOutages.length} of {demoOutages.length} demo incidents.
        </p>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}