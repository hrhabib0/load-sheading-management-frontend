"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  ListTodo,
  RefreshCw,
  Search,
  ClipboardList,
  ArrowUpRight,
  XCircle,
} from "lucide-react";

import { useGetAllWorkTasks } from "@/hooks";
import type { IWorkTask } from "@/types/work-task.type";

import { PageLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TaskStatus =
  | "PENDING"
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"
  | "FAILED";

type StatusFilter = "ALL" | TaskStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "FAILED", label: "Failed" },
];

const STATUS_STYLES: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  ASSIGNED: {
    label: "Assigned",
    className:
      "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  ACCEPTED: {
    label: "Accepted",
    className:
      "border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  },
  IN_PROGRESS: {
    label: "In progress",
    className:
      "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-400",
  },
  FAILED: {
    label: "Failed",
    className:
      "border-destructive/25 bg-destructive/10 text-destructive",
  },
};

function getTaskStatus(status: string) {
  return (
    STATUS_STYLES[status as TaskStatus] ?? {
      label: status.replaceAll("_", " "),
      className: "border-border bg-muted text-muted-foreground",
    }
  );
}

function formatDate(value?: string | Date | null) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not recorded";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof ClipboardList;
  iconClassName: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

function TaskStatusBadge({ status }: { status: string }) {
  const config = getTaskStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

function TaskCard({
  task,
  onView,
}: {
  task: IWorkTask;
  onView: () => void;
}) {
  const feederName = task.incident?.feeder?.name ?? "Feeder unavailable";
  const feederCode = task.incident?.feeder?.code;

  return (
    <article className="group rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4">
        {/* Task heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="size-5" />
            </div>

            <div className="min-w-0">
              <h3 className="break-words font-semibold leading-6">
                {task.title}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Task ID: {task.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <TaskStatusBadge status={task.status} />
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {task.description || "No additional task description provided."}
        </p>

        {/* Task details */}
        <div className="grid gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Related feeder
            </p>

            <p className="mt-1 break-words text-sm font-medium">
              {feederName}
              {feederCode ? ` (${feederCode})` : ""}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Created
            </p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(task.createdAt)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 className="size-3.5 shrink-0" />
            {task.status === "IN_PROGRESS"
              ? "Work is currently in progress"
              : task.status === "COMPLETED"
                ? "Task completed"
                : task.status === "PENDING"
                  ? "Awaiting assignment or processing"
                  : "Check task details for the next action"}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onView}
          >
            View details
            <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function TechnicianTasksPage() {
  const router = useRouter();

  const {
    data: tasksData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllWorkTasks();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  // IMPORTANT:
  // Do not remove PENDING tasks here.
  // The backend determines which tasks the current role can access.
  const tasks = (tasksData?.data ?? []) as IWorkTask[];

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "PENDING").length,
      active: tasks.filter(
        (task) =>
          task.status === "ASSIGNED" ||
          task.status === "ACCEPTED" ||
          task.status === "IN_PROGRESS",
      ).length,
      completed: tasks.filter(
        (task) => task.status === "COMPLETED",
      ).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return tasks
      .filter((task) => {
        const matchesStatus =
          statusFilter === "ALL" || task.status === statusFilter;

        const searchableText = [
          task.id,
          task.title,
          task.description,
          task.status,
          task.incident?.feeder?.name,
          task.incident?.feeder?.code,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesStatus && searchableText.includes(query);
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return dateB - dateA;
      });
  }, [tasks, searchTerm, statusFilter]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

          <div className="flex-1">
            <h2 className="font-semibold">
              Unable to load work tasks
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Something went wrong while retrieving task records.
              Please try again.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="size-4 text-primary" />
            Operations
            <span>/</span>
            <span>Work tasks</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Work Tasks
          </h1>

          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Track assignments, monitor repair progress, and review
            task history.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="w-full sm:w-fit"
        >
          <RefreshCw
            className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh tasks
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total tasks"
          value={stats.total}
          description="All tasks returned by the API"
          icon={ClipboardList}
          iconClassName="bg-primary/10 text-primary"
        />

        <SummaryCard
          title="Pending"
          value={stats.pending}
          description="Awaiting further processing"
          icon={Clock3}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <SummaryCard
          title="Active tasks"
          value={stats.active}
          description="Assigned, accepted, or in progress"
          icon={Activity}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <SummaryCard
          title="Completed"
          value={stats.completed}
          description="Successfully completed tasks"
          icon={CheckCircle2}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Task list */}
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">Task records</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Showing {filteredTasks.length} of {tasks.length} tasks.
                Pending tasks are included by default.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search tasks..."
                  className="pl-9"
                  aria-label="Search work tasks"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                aria-label="Filter tasks by status"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-48"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-5 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                {tasks.length === 0 ? (
                  <ClipboardList className="size-6 text-muted-foreground" />
                ) : (
                  <Search className="size-6 text-muted-foreground" />
                )}
              </div>

              <h3 className="mt-4 font-semibold">
                {tasks.length === 0
                  ? "No work tasks available"
                  : "No matching tasks"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {tasks.length === 0
                  ? "No tasks were returned for your account. New tasks will appear here when available."
                  : "Try another search term or choose a different status filter."}
              </p>

              {(searchTerm || statusFilter !== "ALL") && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                  }}
                >
                  Clear filters
                </Button>
              )}

              {tasks.length === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw
                    className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={() =>
                    router.push(`/dashboard/tasks/${task.id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* List footer */}
        {tasks.length > 0 && (
          <div className="flex flex-col gap-2 border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span>
              {filteredTasks.length} task
              {filteredTasks.length === 1 ? "" : "s"} displayed
            </span>

            <span className="inline-flex items-center gap-1.5">
              <XCircle className="size-3.5" />
              Use search or status filters to narrow the list.
            </span>
          </div>
        )}
      </section>
    </div>
  );
}