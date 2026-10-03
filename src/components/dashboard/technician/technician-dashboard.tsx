"use client";

import {
  CheckCircle2,
  Clock3,
  ClipboardList,
  Wrench,
} from "lucide-react";

import { useGetAllWorkTasks } from "@/hooks";
import type { IWorkTask } from "@/types/work-task.type";
import { StatCard } from "../stat-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function getTaskStatusLabel(status: IWorkTask["status"]) {
  switch (status) {
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
      return "Pending";
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
      return "bg-red-500/10 text-red-600";
    case "FAILED":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function TechnicianDashboard() {
    const router = useRouter();
    const {
        data: tasksData,
        isLoading,
        isError,
    } = useGetAllWorkTasks();

    const tasks = tasksData?.data ?? [];

    const assignedTasks = tasks.filter(
        (task) => task.status === "ASSIGNED",
    );

    const inProgressTasks = tasks.filter(
        (task) => task.status === "IN_PROGRESS",
    );

    const completedTasks = tasks.filter(
        (task) => task.status === "COMPLETED",
    );

    const activeTasks = tasks.filter((task) =>
        ["ASSIGNED", "ACCEPTED", "IN_PROGRESS"].includes(task.status),
    );

    if (isLoading) {
        return (
        <div className="space-y-6">
            <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Technician Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Loading your work tasks...
            </p>
            </div>
        </div>
        );
    }

    if (isError) {
        return (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <h2 className="font-semibold text-destructive">
            Unable to load work tasks
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while retrieving your tasks.
            </p>
        </div>
        );
    }

    return (
        <div className="space-y-6">
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Technician Dashboard
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
            Manage your assigned work tasks and track repair progress.
            </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
            title="Assigned Tasks"
            value={assignedTasks.length}
            description="Waiting for you"
            icon={ClipboardList}
            />

            <StatCard
            title="Active Tasks"
            value={activeTasks.length}
            description="Currently assigned"
            icon={Wrench}
            />

            <StatCard
            title="In Progress"
            value={inProgressTasks.length}
            description="Currently working"
            icon={Clock3}
            />

            <StatCard
            title="Completed"
            value={completedTasks.length}
            description="Successfully completed"
            icon={CheckCircle2}
            />
        </div>

        {/* Tasks */}
        <div className="rounded-xl border bg-background shadow-sm">
            <div className="border-b p-5">
            <h2 className="font-semibold tracking-tight">My Tasks</h2>

            <p className="mt-1 text-sm text-muted-foreground">
                Your assigned and active work tasks.
            </p>
            </div>

            {activeTasks.length === 0 ? (
            <div className="p-8 text-center">
                <ClipboardList className="mx-auto size-8 text-muted-foreground" />

                <h3 className="mt-3 font-medium">No active tasks</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                You currently have no assigned work tasks.
                </p>
            </div>
            ) : (
            <div className="divide-y">
                    {activeTasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                        >
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-medium">{task.title}</h3>

                                    <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTaskStatusClass(
                                        task.status,
                                    )}`}
                                    >
                                    {getTaskStatusLabel(task.status)}
                                    </span>
                                </div>

                                {task.description && (
                                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                    {task.description}
                                    </p>
                                )}

                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
                                        Outage:{" "}
                                        <span className="font-medium text-foreground">
                                            {getTaskStatusLabel(
                                            task.incident.status as IWorkTask["status"],
                                            )}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                <span className="text-xs text-muted-foreground">
                                    {task.assignedAt
                                    ? new Date(task.assignedAt).toLocaleDateString()
                                    : "Not assigned"}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.push(`/dashboard/tasks/${task.id}`)
                                    }
                                >
                                    View Task
                                </Button>
                            </div>
                    </div>
                    ))}
            </div>
            )}
        </div>
        </div>
    );
}