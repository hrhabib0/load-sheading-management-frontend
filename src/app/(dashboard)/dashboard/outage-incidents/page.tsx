"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardPlus,
  Clock3,
  Copy,
  Eye,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Zap,
} from "lucide-react";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAllOutageIncidents } from "@/hooks";
import { CreateWorkTaskDialog } from "@/components/dashboard/work-task/CreateWorkTaskDialog";
import apiClient from "@/lib/apiClient";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type IncidentStatus =
  | "INVESTIGATING"
  | "REPAIRING"
  | "RESTORATION_PENDING"
  | "RESTORED"
  | "CLOSED";

type WorkTaskStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"
  | "FAILED";

type WorkTaskSummary = {
  id: string;
  status: WorkTaskStatus;
};

type OutageIncident = {
  id: string;
  status: IncidentStatus;
  description?: string | null;
  startedAt?: string | null;
  restoredAt?: string | null;
  closedAt?: string | null;
  verifiedAt?: string | null;
  resolutionNote?: string | null;
  createdAt: string;
  updatedAt?: string;
  feederId?: string;
  feeder?: {
    id?: string;
    name?: string;
    code?: string;
    substation?: {
      id?: string;
      name?: string;
      zone?: {
        id?: string;
        name?: string;
      } | null;
    } | null;
  } | null;
  tasks?: WorkTaskSummary[];
};

type Feeder = {
  id: string;
  name: string;
  code?: string | null;
  isActive: boolean;
  substation?: {
    name?: string;
    zone?: {
      name?: string;
    } | null;
  } | null;
};

type ApiListResponse<T> = {
  data?: T[];
  message?: string;
};

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "REPAIRING", label: "Repairing" },
  { value: "RESTORATION_PENDING", label: "Restoration pending" },
  { value: "RESTORED", label: "Restored" },
  { value: "CLOSED", label: "Closed" },
] as const;

const ACTIVE_TASK_STATUSES: WorkTaskStatus[] = [
  "ASSIGNED",
  "ACCEPTED",
  "IN_PROGRESS",
];

const statusStyles: Record<
  IncidentStatus,
  {
    label: string;
    className: string;
    icon: typeof Activity;
  }
> = {
  INVESTIGATING: {
    label: "Investigating",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: Search,
  },
  REPAIRING: {
    label: "Repairing",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    icon: Activity,
  },
  RESTORATION_PENDING: {
    label: "Restoration pending",
    className:
      "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
    icon: Clock3,
  },
  RESTORED: {
    label: "Restored",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  CLOSED: {
    label: "Closed",
    className: "border-muted bg-muted text-muted-foreground",
    icon: CheckCircle2,
  },
};

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not recorded";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getIncidentCode(id: string) {
  return `INC-${id.slice(0, 8).toUpperCase()}`;
}

function getTaskButtonState(incident: OutageIncident) {
  const eligibleStatuses: IncidentStatus[] = [
    "INVESTIGATING",
    "REPAIRING",
  ];

  if (!eligibleStatuses.includes(incident.status)) {
    return {
      disabled: true,
      reason:
        incident.status === "RESTORATION_PENDING"
          ? "Restoration verification has started."
          : incident.status === "RESTORED"
            ? "This incident has already been restored."
            : incident.status === "CLOSED"
              ? "This incident is closed."
              : "Tasks cannot be created at this stage.",
    };
  }

  // Fail safely. Do not assume no tasks exist when the API omits the field.
  if (!Array.isArray(incident.tasks)) {
    return {
      disabled: true,
      reason:
        "Task information is unavailable. Refresh the incident list or include tasks in the API response.",
    };
  }

  const activeTask = incident.tasks.find((task) =>
    ACTIVE_TASK_STATUSES.includes(task.status),
  );

  if (activeTask) {
    return {
      disabled: true,
      reason: `An active task already exists (${activeTask.status.replaceAll("_", " ").toLowerCase()}).`,
    };
  }

  return {
    disabled: false,
    reason: "Create a work task for this incident.",
  };
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const data = (error as { data?: { message?: string } }).data;

    if (data?.message) return data.message;
  }

  if (error instanceof Error) return error.message;

  return "Something went wrong. Please try again.";
}

/* -------------------------------------------------------------------------- */
/*                                UI Components                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: IncidentStatus }) {
  const config = statusStyles[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
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
  icon: typeof Activity;
  iconClassName: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
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

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Create Incident Dialog                           */
/* -------------------------------------------------------------------------- */

function CreateOutageIncidentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const [feederId, setFeederId] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: feederResponse,
    isLoading: isLoadingFeeders,
    isError: isFeederError,
    refetch: refetchFeeders,
  } = useQuery({
    queryKey: ["feeders", "active-for-incident"],
    queryFn: () =>
      apiClient<ApiListResponse<Feeder>>("/feeders"),
    enabled: open,
  });

  const feeders = (feederResponse?.data ?? []).filter(
    (feeder) => feeder.isActive,
  );

  const createIncidentMutation = useMutation({
    mutationFn: (payload: {
      feederId: string;
      description: string;
    }) =>
      apiClient("/outage-incidents", {
        method: "POST",
        body: payload,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["outage-incidents"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["customer-reports"],
      });

      toast.add({
        title: "Incident created",
        description: "The outage incident was created successfully.",
        type: "success",
      });

      setFeederId("");
      setDescription("");
      onOpenChange(false);
    },

    onError: (error) => {
      toast.add({
        title: "Unable to create incident",
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedDescription = description.trim();

    if (!feederId) {
      toast.add({
        title: "Select a feeder",
        description: "Choose the feeder affected by this outage.",
        type: "error",
      });
      return;
    }

    if (trimmedDescription.length < 10) {
      toast.add({
        title: "Description is too short",
        description: "Enter at least 10 characters describing the problem.",
        type: "error",
      });
      return;
    }

    if (trimmedDescription.length > 1000) {
      toast.add({
        title: "Description is too long",
        description: "Keep the description within 1000 characters.",
        type: "error",
      });
      return;
    }

    createIncidentMutation.mutate({
      feederId,
      description: trimmedDescription,
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (createIncidentMutation.isPending) return;

    if (!nextOpen) {
      setFeederId("");
      setDescription("");
      createIncidentMutation.reset();
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="size-5" />
            </span>
            Create outage incident
          </DialogTitle>

          <DialogDescription>
            Record an unexpected power interruption. The incident will begin
            in the Investigating status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <label htmlFor="incident-feeder" className="text-sm font-medium">
              Affected feeder <span className="text-destructive">*</span>
            </label>

            <select
              id="incident-feeder"
              value={feederId}
              onChange={(event) => setFeederId(event.target.value)}
              disabled={
                isLoadingFeeders ||
                isFeederError ||
                createIncidentMutation.isPending
              }
              required
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {isLoadingFeeders
                  ? "Loading feeders..."
                  : "Select a feeder"}
              </option>

              {feeders.map((feeder) => (
                <option key={feeder.id} value={feeder.id}>
                  {feeder.name}
                  {feeder.code ? ` (${feeder.code})` : ""}
                  {feeder.substation?.name
                    ? ` — ${feeder.substation.name}`
                    : ""}
                </option>
              ))}
            </select>

            {isFeederError && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-xs text-destructive">
                  Unable to load feeders.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void refetchFeeders()}
                >
                  Retry
                </Button>
              </div>
            )}

            {!isLoadingFeeders &&
              !isFeederError &&
              feeders.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No active feeders are available.
                </p>
              )}

            <p className="text-xs text-muted-foreground">
              The affected areas are determined by the selected feeder.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="incident-description"
              className="text-sm font-medium"
            >
              Problem description{" "}
              <span className="text-destructive">*</span>
            </label>

            <textarea
              id="incident-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the outage, observed symptoms, and any relevant details..."
              minLength={10}
              maxLength={1000}
              rows={5}
              required
              disabled={createIncidentMutation.isPending}
              className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="flex justify-between gap-3 text-xs text-muted-foreground">
              <span>Minimum 10 characters</span>
              <span>{description.length}/1000</span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-5 text-muted-foreground">
              Creating an incident does not mean power has been restored.
              Restoration must be verified through the operational workflow.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createIncidentMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createIncidentMutation.isPending ||
                isLoadingFeeders ||
                isFeederError ||
                feeders.length === 0
              }
            >
              {createIncidentMutation.isPending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Create incident
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Incident Page                                */
/* -------------------------------------------------------------------------- */

export default function OutageIncidentsPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllOutageIncidents();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedIncident, setSelectedIncident] =
    useState<OutageIncident | null>(null);

  const [selectedIncidentForTask, setSelectedIncidentForTask] =
    useState<OutageIncident | null>(null);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);
  const [copiedIncidentId, setCopiedIncidentId] = useState(false);

  // Expected response shape: { data: OutageIncident[] }.
  const incidents = (data?.data ?? []) as OutageIncident[];

  const stats = useMemo(() => {
    return {
      total: incidents.length,
      investigating: incidents.filter(
        (incident) => incident.status === "INVESTIGATING",
      ).length,
      repairing: incidents.filter(
        (incident) => incident.status === "REPAIRING",
      ).length,
      restorationPending: incidents.filter(
        (incident) => incident.status === "RESTORATION_PENDING",
      ).length,
      active: incidents.filter((incident) =>
        [
          "INVESTIGATING",
          "REPAIRING",
          "RESTORATION_PENDING",
        ].includes(incident.status),
      ).length,
    };
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return incidents
      .filter((incident) => {
        const matchesStatus =
          statusFilter === "ALL" || incident.status === statusFilter;

        const searchableText = [
          incident.id,
          incident.description,
          incident.feeder?.name,
          incident.feeder?.code,
          incident.feeder?.substation?.name,
          incident.feeder?.substation?.zone?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesStatus && searchableText.includes(query);
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [incidents, searchTerm, statusFilter]);

  async function handleCopyIncidentId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedIncidentId(true);

      window.setTimeout(() => setCopiedIncidentId(false), 2000);
    } catch {
      toast.add({
        title: "Unable to copy",
        description: "Clipboard access is unavailable in this browser.",
        type: "error",
      });
    }
  }

  function openCreateTaskDialog(incident: OutageIncident) {
    const taskState = getTaskButtonState(incident);

    if (taskState.disabled) return;

    setSelectedIncidentForTask(incident);
    setIsCreateTaskOpen(true);
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="size-4 text-primary" />
            <span>Operations</span>
            <ChevronRight className="size-4" />
            <span>Outage incidents</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Outage incidents
          </h1>

          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Monitor unexpected power interruptions, coordinate repair work,
            and track restoration progress.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="w-full sm:w-fit"
          >
            <RefreshCw
              className={`mr-2 size-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button
            onClick={() => setIsCreateIncidentOpen(true)}
            className="w-full sm:w-fit"
          >
            <Plus className="mr-2 size-4" />
            Create incident
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total incidents"
          value={stats.total}
          description="All recorded incidents"
          icon={ShieldAlert}
          iconClassName="bg-primary/10 text-primary"
        />

        <SummaryCard
          title="Investigating"
          value={stats.investigating}
          description="Incidents under investigation"
          icon={Search}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <SummaryCard
          title="Repairing"
          value={stats.repairing}
          description="Repair work in progress"
          icon={Activity}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <SummaryCard
          title="Restoration pending"
          value={stats.restorationPending}
          description="Awaiting restoration verification"
          icon={Clock3}
          iconClassName="bg-orange-500/10 text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Active incidents notice */}
      {!isLoading && !isError && stats.active > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />

          <div>
            <p className="font-medium">
              {stats.active} active{" "}
              {stats.active === 1 ? "incident" : "incidents"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              These incidents are being investigated, repaired, or awaiting
              restoration verification.
            </p>
          </div>
        </div>
      )}

      {/* Incident records */}
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">Incident records</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Search and filter incidents by status or infrastructure.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search incidents..."
                  className="pl-9"
                  aria-label="Search outage incidents"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter incidents by status"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-52"
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

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4 p-4 sm:p-5">
            {["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
              <div
                key={id}
                className="animate-pulse rounded-lg border p-5"
              >
                <div className="flex justify-between gap-4">
                  <div className="w-full space-y-3">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-28 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && isError && (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" />
            </div>

            <h3 className="mt-4 font-semibold">
              Unable to load outage incidents
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Something went wrong while retrieving incident records. Check
              your connection or try again.
            </p>

            <Button
              className="mt-5"
              variant="outline"
              onClick={() => void refetch()}
            >
              <RefreshCw className="mr-2 size-4" />
              Try again
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredIncidents.length === 0 && (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <ShieldAlert className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              {incidents.length === 0
                ? "No outage incidents yet"
                : "No matching incidents"}
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {incidents.length === 0
                ? "Create an incident when an unexpected power interruption needs investigation."
                : "Try another search term or change the status filter."}
            </p>

            {incidents.length === 0 ? (
              <Button
                className="mt-4"
                onClick={() => setIsCreateIncidentOpen(true)}
              >
                <Plus className="mr-2 size-4" />
                Create incident
              </Button>
            ) : (
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* Incident list */}
        {!isLoading && !isError && filteredIncidents.length > 0 && (
          <>
            <div className="flex items-center justify-between border-b px-4 py-3 text-sm text-muted-foreground sm:px-5">
              <span>
                Showing {filteredIncidents.length} of {incidents.length}{" "}
                incidents
              </span>

              {isFetching && (
                <span className="flex items-center gap-2">
                  <RefreshCw className="size-3.5 animate-spin" />
                  Updating
                </span>
              )}
            </div>

            <div className="divide-y">
              {filteredIncidents.map((incident) => {
                const taskState = getTaskButtonState(incident);

                return (
                  <article
                    key={incident.id}
                    className="p-4 transition-colors hover:bg-muted/20 sm:p-5"
                  >
                    <div className="space-y-4">
                      {/* Incident heading and actions */}
                      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-muted-foreground">
                              {getIncidentCode(incident.id)}
                            </span>

                            <StatusBadge status={incident.status} />
                          </div>

                          <h3 className="font-semibold leading-snug">
                            {incident.description?.trim() ||
                              "No incident description provided"}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            Created {formatDate(incident.createdAt)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-fit"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            <Eye className="mr-2 size-4" />
                            View details
                          </Button>

                          {/* Always visible; disabled when task creation is not allowed. */}
                          <Button
                            size="sm"
                            className="w-full sm:w-fit"
                            disabled={taskState.disabled}
                            title={taskState.reason}
                            aria-label={`Create task for ${getIncidentCode(incident.id)}. ${taskState.reason}`}
                            onClick={() => openCreateTaskDialog(incident)}
                          >
                            <ClipboardPlus className="mr-2 size-4" />
                            Create task
                          </Button>
                        </div>
                      </div>

                      {/* Task eligibility explanation */}
                      <div
                        className={`flex items-start gap-2 rounded-lg border p-3 text-xs ${
                          taskState.disabled
                            ? "border-muted bg-muted/30 text-muted-foreground"
                            : "border-primary/15 bg-primary/5 text-muted-foreground"
                        }`}
                      >
                        {taskState.disabled ? (
                          <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        ) : (
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        )}

                        <p>{taskState.reason}</p>
                      </div>

                      {/* Infrastructure details */}
                      <div className="grid gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2 xl:grid-cols-4">
                        <InfoItem
                          label="Zone"
                          value={
                            incident.feeder?.substation?.zone?.name ??
                            "Not available"
                          }
                        />

                        <InfoItem
                          label="Substation"
                          value={
                            incident.feeder?.substation?.name ??
                            "Not available"
                          }
                        />

                        <InfoItem
                          label="Feeder"
                          value={
                            incident.feeder?.name
                              ? `${incident.feeder.name}${
                                  incident.feeder.code
                                    ? ` (${incident.feeder.code})`
                                    : ""
                                }`
                              : "Not available"
                          }
                        />

                        <InfoItem
                          label="Started at"
                          value={formatDate(incident.startedAt)}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Incident details dialog */}
      <Dialog
        open={Boolean(selectedIncident)}
        onOpenChange={(open) => {
          if (!open) setSelectedIncident(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Outage incident details</DialogTitle>
            <DialogDescription>
              Review the recorded information and current restoration status.
            </DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold">
                  {getIncidentCode(selectedIncident.id)}
                </span>
                <StatusBadge status={selectedIncident.status} />
              </div>

              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {selectedIncident.description ||
                    "No incident description provided."}
                </p>
              </div>

              <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                <InfoItem
                  label="Zone"
                  value={
                    selectedIncident.feeder?.substation?.zone?.name ??
                    "Not available"
                  }
                />

                <InfoItem
                  label="Substation"
                  value={
                    selectedIncident.feeder?.substation?.name ??
                    "Not available"
                  }
                />

                <InfoItem
                  label="Feeder"
                  value={
                    selectedIncident.feeder?.name
                      ? `${selectedIncident.feeder.name}${
                          selectedIncident.feeder.code
                            ? ` (${selectedIncident.feeder.code})`
                            : ""
                        }`
                      : "Not available"
                  }
                />

                <InfoItem
                  label="Created"
                  value={formatDate(selectedIncident.createdAt)}
                />

                <InfoItem
                  label="Started at"
                  value={formatDate(selectedIncident.startedAt)}
                />

                <InfoItem
                  label="Restored at"
                  value={formatDate(selectedIncident.restoredAt)}
                />

                <InfoItem
                  label="Verified at"
                  value={formatDate(selectedIncident.verifiedAt)}
                />

                <InfoItem
                  label="Closed at"
                  value={formatDate(selectedIncident.closedAt)}
                />

                <div className="min-w-0 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Outage incident ID
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="break-all font-mono text-xs font-medium">
                      {selectedIncident.id}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      aria-label="Copy outage incident ID"
                      title="Copy incident ID"
                      onClick={() =>
                        void handleCopyIncidentId(selectedIncident.id)
                      }
                    >
                      {copiedIncidentId ? (
                        <Check className="size-4 text-emerald-600" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Resolution note</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {selectedIncident.resolutionNote ||
                    "No resolution note recorded."}
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create incident dialog */}
      <CreateOutageIncidentDialog
        open={isCreateIncidentOpen}
        onOpenChange={setIsCreateIncidentOpen}
      />

      {/* Create work task dialog */}
      {selectedIncidentForTask && (
        <CreateWorkTaskDialog
          incidentId={selectedIncidentForTask.id}
          incidentLabel={getIncidentCode(selectedIncidentForTask.id)}
          open={isCreateTaskOpen}
          onOpenChange={(open) => {
            setIsCreateTaskOpen(open);

            if (!open) {
              setSelectedIncidentForTask(null);
            }
          }}
        />
      )}
    </div>
  );
}