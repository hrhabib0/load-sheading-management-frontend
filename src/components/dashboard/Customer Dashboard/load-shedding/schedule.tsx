import { ILoadSheddingSchedule } from "@/types/load-shedding.type";
import { CalendarClock, Clock3, Zap } from "lucide-react";

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getDuration = (start: string, end: string) => {
  const durationMs =
    new Date(end).getTime() - new Date(start).getTime();

  const durationMinutes = Math.round(durationMs / (1000 * 60));

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
};

export const getScheduleStatus = (
  schedule: ILoadSheddingSchedule,
) => {
  const now = new Date().getTime();
  const start = new Date(schedule.scheduledStartAt).getTime();
  const end = new Date(schedule.scheduledEndAt).getTime();

  if (now >= start && now <= end) {
    return "IN_PROGRESS";
  }

  if (now < start) {
    return "UPCOMING";
  }

  return "COMPLETED";
};

export function ScheduleCard({
  schedule,
}: {
  schedule: ILoadSheddingSchedule;
}) {
  const status = getScheduleStatus(schedule);

  return (
    <div
      className={`rounded-xl border bg-background p-5 shadow-sm ${
        status === "IN_PROGRESS"
          ? "border-destructive/30"
          : ""
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">{schedule.title}</h2>

            {schedule.description && (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {schedule.description}
              </p>
            )}
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
            status === "IN_PROGRESS"
              ? "bg-destructive/10 text-destructive"
              : status === "UPCOMING"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {status === "IN_PROGRESS"
            ? "In Progress"
            : status === "UPCOMING"
              ? "Upcoming"
              : "Completed"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Date
            </p>
            <p className="text-sm font-medium">
              {formatDate(schedule.scheduledStartAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="size-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Time
            </p>
            <p className="text-sm font-medium">
              {formatTime(schedule.scheduledStartAt)} –{" "}
              {formatTime(schedule.scheduledEndAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="size-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Duration
            </p>
            <p className="text-sm font-medium">
              {getDuration(
                schedule.scheduledStartAt,
                schedule.scheduledEndAt,
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}