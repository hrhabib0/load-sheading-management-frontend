"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  CalendarClock,
  Clock3,
  Zap,
} from "lucide-react";

import { useGetMyAreaLoadShedding } from "@/hooks";
import type { ILoadSheddingSchedule } from "@/types/load-shedding.type";
import { ScheduleCard } from "@/components/dashboard/Customer Dashboard/load-shedding/schedule";



export default function LoadSheddingSchedulePage() {
  const {
    data,
    isLoading,
    isError,
  } = useGetMyAreaLoadShedding();

  const schedules = data?.data ?? [];

  const upcomingSchedules = useMemo(() => {
    const now = new Date().getTime();

    return schedules
      .filter(
        (schedule: any) =>
          new Date(schedule.scheduledStartAt).getTime() > now,
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.scheduledStartAt).getTime() -
          new Date(b.scheduledStartAt).getTime(),
      );
  }, [schedules]);

  const activeSchedule = useMemo(() => {
    const now = new Date().getTime();

    return schedules.find((schedule: any) => {
      const start = new Date(schedule.scheduledStartAt).getTime();
      const end = new Date(schedule.scheduledEndAt).getTime();

      return now >= start && now <= end;
    });
  }, [schedules]);

  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Loading schedule...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertTriangle className="mx-auto size-8 text-destructive" />

        <h2 className="mt-3 font-semibold">
          Unable to load schedule
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <CalendarClock className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Load Shedding Schedule
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View planned load shedding affecting your area.
            </p>
          </div>
        </div>
      </div>

      {/* Active schedule */}
      {activeSchedule && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-center gap-3">
            <Zap className="size-5 text-destructive" />

            <div>
              <p className="text-sm font-medium text-destructive">
                Load shedding is currently in progress
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {activeSchedule.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Upcoming Schedule
          </h2>

          <p className="text-sm text-muted-foreground">
            The next planned load shedding periods for your area.
          </p>
        </div>

        {upcomingSchedules.length === 0 ? (
          <div className="rounded-xl border bg-background p-8 text-center">
            <CalendarClock className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-3 font-semibold">
              No upcoming load shedding
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no upcoming schedules for your area.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingSchedules.map((schedule: any) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}