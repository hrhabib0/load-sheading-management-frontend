"use client";

import {
  CheckCircle2,
  Clock3,
  Eye,
  ListTodo,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/page-loader";
import { StatCard } from "@/components/dashboard/stat-card";

import { useGetAllWorkTasks } from "@/hooks";
import type { IWorkTask } from "@/types/work-task.type";

function getTaskStatusLabel(status: IWorkTask["status"]) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "ASSIGNED":
      return "Assigned";
    case "ACCEPTED":
      return "Accepted";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "REJECTED":
      return "Rejected";
    case "FAILED":
      return "Failed";
    default:
      return status;
  }
}

function getTaskStatusClass(status: IWorkTask["status"]) {
  switch (status) {
    case "ASSIGNED":
      return "bg-blue-500/10 text-blue-600";

    case "ACCEPTED":
      return "bg-yellow-500/10 text-yellow-600";

    case "IN_PROGRESS":
      return "bg-orange-500/10 text-orange-600";

    case "COMPLETED":
      return "bg-green-500/10 text-green-600";

    case "REJECTED":
    case "FAILED":
      return "bg-red-500/10 text-red-600";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatDate(date: string | null) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString();
}

export default function TechnicianTasksPage() {
  const router = useRouter();

  const {
    data: tasksData,
    isLoading,
    isError,
  } = useGetAllWorkTasks();

  const tasks = tasksData?.data ?? [];

  /*
   * PENDING means the task has not been assigned to a technician yet,
   * so it should not appear as an actionable technician task.
   */
  const technicianTasks = tasks.filter(
    (task) => task.status !== "PENDING",
  );

  const assignedTasks = technicianTasks.filter(
    (task) => task.status === "ASSIGNED",
  );

  const activeTasks = technicianTasks.filter((task) =>
    ["ASSIGNED", "ACCEPTED", "IN_PROGRESS"].includes(task.status),
  );

  const inProgressTasks = technicianTasks.filter(
    (task) => task.status === "IN_PROGRESS",
  );

  const completedTasks = technicianTasks.filter(
    (task) => task.status === "COMPLETED",
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="font-semibold text-destructive">
          Failed to load work tasks
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          We could not retrieve your work tasks. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          My Tasks
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your assigned work tasks.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Assigned"
          value={assignedTasks.length}
          description="Waiting for your action"
          icon={ListTodo}
        />

        <StatCard
          title="Active"
          value={activeTasks.length}
          description="Currently active tasks"
          icon={Wrench}
        />

        <StatCard
          title="In Progress"
          value={inProgressTasks.length}
          description="Tasks you are working on"
          icon={Clock3}
        />

        <StatCard
          title="Completed"
          value={completedTasks.length}
          description="Successfully completed"
          icon={CheckCircle2}
        />
      </div>

      {/* Task List */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <div>
            <h2 className="font-semibold">My Work Tasks</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Tasks assigned to you by an operator or zone manager.
            </p>
          </div>
        </div>

        {technicianTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-muted p-3">
              <Wrench className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              No tasks available
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              You don't have any assigned work tasks at the moment.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {technicianTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 md:flex-row md:items-center md:justify-between"
              >
                {/* Task Information */}
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">
                      {task.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTaskStatusClass(
                        task.status,
                      )}`}
                    >
                      {getTaskStatusLabel(task.status)}
                    </span>
                  </div>

                  {task.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      Feeder:{" "}
                      <span className="font-medium text-foreground">
                        {task.incident.feeder.name}
                      </span>
                    </span>

                    <span>
                      Code:{" "}
                      <span className="font-medium text-foreground">
                        {task.incident.feeder.code}
                      </span>
                    </span>

                    <span>
                      Assigned:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(task.assignedAt)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action */}
                <Button
                  variant="outline"
                  className="shrink-0"
                  onClick={() =>
                    router.push(`/dashboard/tasks/${task.id}`)
                  }
                >
                  <Eye />
                  View Task
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}