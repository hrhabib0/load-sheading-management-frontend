"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  Clock,
  MapPin,
  Search,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ScheduleStatus = "PUBLISHED" | "DRAFT" | "COMPLETED";

type LoadSheddingSchedule = {
  id: string;
  scheduleNumber: string;
  zone: string;
  feeder: string;
  area: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: ScheduleStatus;
};

const demoSchedules: LoadSheddingSchedule[] = [
  {
    id: "1",
    scheduleNumber: "LS-2026-001",
    zone: "Dhaka North",
    feeder: "Feeder-01",
    area: "Uttara Sector 4",
    startTime: "2026-10-11T09:00:00",
    endTime: "2026-10-11T11:00:00",
    reason: "Power supply shortage",
    status: "PUBLISHED",
  },
  {
    id: "2",
    scheduleNumber: "LS-2026-002",
    zone: "Dhaka South",
    feeder: "Feeder-02",
    area: "Dhanmondi",
    startTime: "2026-10-11T12:00:00",
    endTime: "2026-10-11T14:00:00",
    reason: "Scheduled load balancing",
    status: "PUBLISHED",
  },
  {
    id: "3",
    scheduleNumber: "LS-2026-003",
    zone: "Dhaka North",
    feeder: "Feeder-03",
    area: "Mirpur Section 10",
    startTime: "2026-10-11T15:00:00",
    endTime: "2026-10-11T17:00:00",
    reason: "Power supply shortage",
    status: "DRAFT",
  },
  {
    id: "4",
    scheduleNumber: "LS-2026-004",
    zone: "Dhaka South",
    feeder: "Feeder-04",
    area: "Lalbagh",
    startTime: "2026-10-10T18:00:00",
    endTime: "2026-10-10T20:00:00",
    reason: "Load distribution",
    status: "COMPLETED",
  },
  {
    id: "5",
    scheduleNumber: "LS-2026-005",
    zone: "Dhaka North",
    feeder: "Feeder-01",
    area: "Uttara Sector 5",
    startTime: "2026-10-12T10:00:00",
    endTime: "2026-10-12T12:00:00",
    reason: "Power supply shortage",
    status: "PUBLISHED",
  },
];

type StatusFilter = "ALL" | ScheduleStatus;

function formatDateTime(date: string) {
  return new Date(date).toLocaleString();
}

function getStatusVariant(status: ScheduleStatus) {
  switch (status) {
    case "PUBLISHED":
      return "default";
    case "DRAFT":
      return "secondary";
    case "COMPLETED":
      return "outline";
  }
}

export default function LoadSheddingDemoPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const publishedCount = demoSchedules.filter(
    (schedule) => schedule.status === "PUBLISHED",
  ).length;

  const draftCount = demoSchedules.filter(
    (schedule) => schedule.status === "DRAFT",
  ).length;

  const completedCount = demoSchedules.filter(
    (schedule) => schedule.status === "COMPLETED",
  ).length;

  const filteredSchedules = useMemo(() => {
    const query = search.trim().toLowerCase();

    return demoSchedules.filter((schedule) => {
      const matchesSearch =
        !query ||
        [
          schedule.scheduleNumber,
          schedule.zone,
          schedule.feeder,
          schedule.area,
          schedule.reason,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        schedule.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <main className="space-y-6 p-4 md:p-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Load Shedding
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View planned power interruptions and their schedules.
          </p>
        </div>

        <Badge variant="outline">Demo data</Badge>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Schedules"
          value={demoSchedules.length}
          icon={<CalendarClock className="size-5" />}
        />

        <Stat
          label="Published"
          value={publishedCount}
          icon={<Zap className="size-5" />}
        />

        <Stat
          label="Draft"
          value={draftCount}
          icon={<Clock className="size-5" />}
        />

        <Stat
          label="Completed"
          value={completedCount}
          icon={<CalendarClock className="size-5" />}
        />
      </div>

      {/* Schedule list */}
      <section className="space-y-4 rounded-xl border bg-card p-4 md:p-5">
        <div>
          <h2 className="font-semibold">Load-Shedding Schedules</h2>
          <p className="text-sm text-muted-foreground">
            Search schedules by zone, feeder, area, or schedule number.
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search schedules..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              ["ALL", "PUBLISHED", "DRAFT", "COMPLETED"] as const
            ).map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={
                  statusFilter === filter ? "default" : "outline"
                }
                onClick={() => setStatusFilter(filter)}
              >
                {filter === "ALL"
                  ? "All"
                  : filter.charAt(0) +
                    filter.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredSchedules.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground" />

            <p className="font-medium">No schedules found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try another search term or status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSchedules.map((schedule) => (
              <article
                key={schedule.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        {schedule.scheduleNumber}
                      </span>

                      <Badge
                        variant={getStatusVariant(schedule.status)}
                      >
                        {schedule.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="font-medium">{schedule.area}</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {schedule.reason}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-4" />
                        {schedule.zone}
                      </span>

                      <span>{schedule.feeder}</span>
                    </div>

                    <div className="grid gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Start time
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {formatDateTime(schedule.startTime)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          End time
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {formatDateTime(schedule.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Showing {filteredSchedules.length} of{" "}
          {demoSchedules.length} demo schedules.
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

      <p className="mt-3 text-2xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}