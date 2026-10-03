"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Wrench,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PageLoader } from "@/components/shared/page-loader";

import {
  useAcceptWorkTask,
  useCompleteWorkTask,
  useFailWorkTask,
  useGetAllWorkTasks,
  useRejectWorkTask,
  useStartWorkTask,
} from "@/hooks";

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

function getIncidentStatusLabel(
  status: IWorkTask["incident"]["status"],
) {
  switch (status) {
    case "INVESTIGATING":
      return "Investigating";

    case "REPAIRING":
      return "Repairing";

    case "RESTORATION_PENDING":
      return "Restoration Pending";

    case "RESTORED":
      return "Restored";

    case "CLOSED":
      return "Closed";

    default:
      return status;
  }
}

function getIncidentStatusClass(
  status: IWorkTask["incident"]["status"],
) {
  switch (status) {
    case "INVESTIGATING":
      return "bg-yellow-500/10 text-yellow-600";

    case "REPAIRING":
      return "bg-orange-500/10 text-orange-600";

    case "RESTORATION_PENDING":
      return "bg-blue-500/10 text-blue-600";

    case "RESTORED":
    case "CLOSED":
      return "bg-green-500/10 text-green-600";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatDate(date: string | null) {
  if (!date) {
    return "Not available";
  }

  return new Date(date).toLocaleString();
}

export default function WorkTaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const taskId = params.id;

  const [rejectionReason, setRejectionReason] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [repairNote, setRepairNote] = useState("");

  const {
    data: tasksData,
    isLoading,
    isError,
  } = useGetAllWorkTasks();

  const acceptMutation = useAcceptWorkTask();
  const rejectMutation = useRejectWorkTask();
  const startMutation = useStartWorkTask();
  const completeMutation = useCompleteWorkTask();
  const failMutation = useFailWorkTask();

  const task = tasksData?.data.find(
    (item) => item.id === taskId,
  );

  const isMutating =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    startMutation.isPending ||
    completeMutation.isPending ||
    failMutation.isPending;

  const handleAccept = () => {
    acceptMutation.mutate(taskId);
  };

  const handleReject = () => {
    const reason = rejectionReason.trim();

    if (!reason) {
      return;
    }

    rejectMutation.mutate(
      {
        taskId,
        rejectionReason: reason,
      },
      {
        onSuccess: () => {
          setRejectionReason("");
        },
      },
    );
  };

  const handleStart = () => {
    startMutation.mutate(taskId);
  };

  const handleComplete = () => {
    const note = repairNote.trim();

    if (!note) {
      return;
    }

    completeMutation.mutate(
      {
        taskId,
        repairNote: note,
      },
      {
        onSuccess: () => {
          setRepairNote("");
        },
      },
    );
  };

  const handleFail = () => {
    const reason = failureReason.trim();

    if (!reason) {
      return;
    }

    failMutation.mutate(
      {
        taskId,
        failureReason: reason,
      },
      {
        onSuccess: () => {
          setFailureReason("");
        },
      },
    );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !task) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Back
        </Button>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive">
            Work task not found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The requested work task could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          className="-ml-3 mb-3"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Back to Tasks
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {task.title}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Work task details and available actions.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${getTaskStatusClass(
              task.status,
            )}`}
          >
            {getTaskStatusLabel(task.status)}
          </span>
        </div>
      </div>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Information */}
        <div className="rounded-xl border bg-background shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">
              Task Information
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Title
              </p>

              <p className="mt-1 text-sm font-medium">
                {task.title}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Description
              </p>

              <p className="mt-1 text-sm leading-6">
                {task.description ||
                  "No description provided."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Assigned At
                </p>

                <p className="mt-1 text-sm">
                  {formatDate(task.assignedAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Accepted At
                </p>

                <p className="mt-1 text-sm">
                  {formatDate(task.acceptedAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Started At
                </p>

                <p className="mt-1 text-sm">
                  {formatDate(task.startedAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Completed At
                </p>

                <p className="mt-1 text-sm">
                  {formatDate(task.completedAt)}
                </p>
              </div>
            </div>

            {task.rejectionReason && (
              <div className="rounded-lg bg-red-500/5 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Rejection Reason
                </p>

                <p className="mt-1 text-sm text-destructive">
                  {task.rejectionReason}
                </p>
              </div>
            )}

            {task.failureReason && (
              <div className="rounded-lg bg-red-500/5 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Failure Reason
                </p>

                <p className="mt-1 text-sm text-destructive">
                  {task.failureReason}
                </p>
              </div>
            )}

            {task.repairNote && (
              <div className="rounded-lg bg-green-500/5 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Repair Note
                </p>

                <p className="mt-1 text-sm">
                  {task.repairNote}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Outage Information */}
        <div className="rounded-xl border bg-background shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">
              Outage Information
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Outage Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getIncidentStatusClass(
                  task.incident.status,
                )}`}
              >
                {getIncidentStatusLabel(
                  task.incident.status,
                )}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Feeder
              </p>

              <p className="mt-1 text-sm font-medium">
                {task.incident.feeder.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {task.incident.feeder.code}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Incident ID
              </p>

              <p className="mt-1 break-all font-mono text-xs">
                {task.incident.id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Created By
              </p>

              <p className="mt-1 text-sm">
                {task.creator.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {task.creator.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Task Actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the task according to your current work status.
          </p>
        </div>

        <div className="p-5">
          {/* ASSIGNED */}
          {task.status === "ASSIGNED" && (
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={isMutating}
                onClick={handleAccept}
              >
                {acceptMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 />
                )}

                Accept Task
              </Button>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      variant="outline"
                      disabled={isMutating}
                    />
                  }
                >
                  <XCircle />
                  Reject Task
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Reject Work Task
                    </DialogTitle>

                    <DialogDescription>
                      Please provide a reason for rejecting
                      this task.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2">
                    <label
                      htmlFor="rejectionReason"
                      className="text-sm font-medium"
                    >
                      Rejection Reason
                    </label>

                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(event) =>
                        setRejectionReason(
                          event.target.value,
                        )
                      }
                      placeholder="Explain why you cannot accept this task..."
                      rows={4}
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose
                      render={
                        <Button variant="outline" />
                      }
                    >
                      Cancel
                    </DialogClose>

                    <Button
                      variant="destructive"
                      disabled={
                        isMutating ||
                        !rejectionReason.trim()
                      }
                      onClick={handleReject}
                    >
                      {rejectMutation.isPending && (
                        <Loader2 className="animate-spin" />
                      )}

                      Reject Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* ACCEPTED */}
          {task.status === "ACCEPTED" && (
            <Button
              disabled={isMutating}
              onClick={handleStart}
            >
              {startMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wrench />
              )}

              Start Work
            </Button>
          )}

          {/* IN_PROGRESS */}
          {task.status === "IN_PROGRESS" && (
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      disabled={isMutating}
                    />
                  }
                >
                  <CheckCircle2 />
                  Complete Task
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Complete Work Task
                    </DialogTitle>

                    <DialogDescription>
                      Add a repair note describing the work
                      that was completed.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2">
                    <label
                      htmlFor="repairNote"
                      className="text-sm font-medium"
                    >
                      Repair Note
                    </label>

                    <Textarea
                      id="repairNote"
                      value={repairNote}
                      onChange={(event) =>
                        setRepairNote(
                          event.target.value,
                        )
                      }
                      placeholder="Describe the repair work that was completed..."
                      rows={5}
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose
                      render={
                        <Button variant="outline" />
                      }
                    >
                      Cancel
                    </DialogClose>

                    <Button
                      disabled={
                        isMutating ||
                        !repairNote.trim()
                      }
                      onClick={handleComplete}
                    >
                      {completeMutation.isPending && (
                        <Loader2 className="animate-spin" />
                      )}

                      Complete Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      variant="outline"
                      disabled={isMutating}
                    />
                  }
                >
                  <XCircle />
                  Mark as Failed
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Mark Task as Failed
                    </DialogTitle>

                    <DialogDescription>
                      Please explain why the task could not
                      be completed.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2">
                    <label
                      htmlFor="failureReason"
                      className="text-sm font-medium"
                    >
                      Failure Reason
                    </label>

                    <Textarea
                      id="failureReason"
                      value={failureReason}
                      onChange={(event) =>
                        setFailureReason(
                          event.target.value,
                        )
                      }
                      placeholder="Explain what prevented the task from being completed..."
                      rows={4}
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose
                      render={
                        <Button variant="outline" />
                      }
                    >
                      Cancel
                    </DialogClose>

                    <Button
                      variant="destructive"
                      disabled={
                        isMutating ||
                        !failureReason.trim()
                      }
                      onClick={handleFail}
                    >
                      {failMutation.isPending && (
                        <Loader2 className="animate-spin" />
                      )}

                      Mark as Failed
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* COMPLETED */}
          {task.status === "COMPLETED" && (
            <div className="flex items-start gap-3 rounded-lg bg-green-500/10 p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />

              <div>
                <p className="font-medium text-green-700">
                  Task completed
                </p>

                <p className="mt-1 text-sm text-green-700/80">
                  This task has been successfully
                  completed.
                </p>
              </div>
            </div>
          )}

          {/* REJECTED */}
          {task.status === "REJECTED" && (
            <div className="flex items-start gap-3 rounded-lg bg-red-500/10 p-4">
              <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" />

              <div>
                <p className="font-medium text-red-700">
                  Task rejected
                </p>

                {task.rejectionReason && (
                  <p className="mt-1 text-sm text-red-700/80">
                    {task.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* FAILED */}
          {task.status === "FAILED" && (
            <div className="flex items-start gap-3 rounded-lg bg-red-500/10 p-4">
              <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" />

              <div>
                <p className="font-medium text-red-700">
                  Task marked as failed
                </p>

                {task.failureReason && (
                  <p className="mt-1 text-sm text-red-700/80">
                    {task.failureReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PENDING */}
          {task.status === "PENDING" && (
            <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
              <Clock3 className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

              <div>
                <p className="font-medium">
                  Task is pending
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  This task has not been assigned to a
                  technician yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}