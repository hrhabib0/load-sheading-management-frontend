"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  RefreshCw,
  Search,
  ShieldAlert,
  Zap,
} from "lucide-react";

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

type IncidentStatus =
  | "INVESTIGATING"
  | "REPAIRING"
  | "RESTORATION_PENDING"
  | "RESTORED"
  | "CLOSED";

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
  creator?: {
    name?: string;
    email?: string;
  } | null;
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "REPAIRING", label: "Repairing" },
  { value: "RESTORATION_PENDING", label: "Restoration pending" },
  { value: "RESTORED", label: "Restored" },
  { value: "CLOSED", label: "Closed" },
] as const;

const statusStyles: Record<
  IncidentStatus,
  { label: string; className: string; icon: typeof Activity }
> = {
  INVESTIGATING: {
    label: "Investigating",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: Search,
  },
  REPAIRING: {
    label: "Repairing",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    icon: Activity,
  },
  RESTORATION_PENDING: {
    label: "Restoration pending",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
    icon: Clock3,
  },
  RESTORED: {
    label: "Restored",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  CLOSED: {
    label: "Closed",
    className: "border-muted bg-muted text-muted-foreground",
    icon: CheckCircle2,
  },
};

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
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
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
  const [selectedIncident, setSelectedIncident] = useState<OutageIncident | null>(null);
  const [copiedIncidentId, setCopiedIncidentId] = useState(false);

  // The API response is expected to return { data: IOutageIncident[] }.
  const incidents = (data?.data ?? []) as OutageIncident[];

  const stats = useMemo(() => {
    const active = incidents.filter((incident) =>
      ["INVESTIGATING", "REPAIRING", "RESTORATION_PENDING"].includes(
        incident.status,
      ),
    ).length;

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
      active,
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

  return (
    <div className="space-y-6 pb-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="size-4 text-primary" />
            Operations
            <ChevronRight className="size-4" />
            <span>Outage incidents</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Outage Incidents
          </h1>

          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Monitor unexpected power interruptions, track repair progress, and
            review restoration status.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="w-full sm:w-fit"
        >
          <RefreshCw
            className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh incidents
        </Button>
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
          description="Awaiting investigation"
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

      {/* Active incident banner */}
      {!isLoading && !isError && stats.active > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium">
              {stats.active} active{" "}
              {stats.active === 1 ? "incident" : "incidents"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              These incidents are still being investigated, repaired, or
              awaiting restoration verification.
            </p>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">Incident records</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Search by incident ID, feeder, substation, zone, or description.
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
                {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"].map(
                (skeletonId) => (
                    <div
                    key={skeletonId}
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
                ),
                )}
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
              Something went wrong while retrieving incident records. Please
              check your connection or try again.
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

        {/* Empty and filtered results */}
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
                ? "When an unexpected outage is recorded, its details and status will appear here."
                : "Try another search term or change the status filter."}
            </p>
            {(searchTerm || statusFilter !== "ALL") && (
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
              {filteredIncidents.map((incident) => (
                <article
                  key={incident.id}
                  className="p-4 transition-colors hover:bg-muted/30 sm:p-5"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
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
                          Reported {formatDate(incident.createdAt)}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full shrink-0 sm:w-fit"
                        onClick={() => setSelectedIncident(incident)}
                      >
                        <Eye className="mr-2 size-4" />
                        View details
                      </Button>
                    </div>

                    <div className="grid gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Zone</p>
                        <p className="mt-1 text-sm font-medium">
                          {incident.feeder?.substation?.zone?.name ||
                            "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Substation
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {incident.feeder?.substation?.name ||
                            "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Feeder</p>
                        <p className="mt-1 text-sm font-medium">
                          {incident.feeder?.name || "Not available"}
                          {incident.feeder?.code
                            ? ` (${incident.feeder.code})`
                            : ""}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Started at
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {formatDate(incident.startedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
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
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {selectedIncident.description ||
                    "No incident description provided."}
                </p>
              </div>

              <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Zone</p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedIncident.feeder?.substation?.zone?.name ||
                      "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Substation</p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedIncident.feeder?.substation?.name ||
                      "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Feeder</p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedIncident.feeder?.name || "Not available"}
                    {selectedIncident.feeder?.code
                      ? ` (${selectedIncident.feeder.code})`
                      : ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(selectedIncident.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Started at</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(selectedIncident.startedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Restored at</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(selectedIncident.restoredAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Verified at</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(selectedIncident.verifiedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Closed at</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(selectedIncident.closedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Outage Incident ID</p>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="break-all font-mono text-sm font-medium">
                      {selectedIncident.id}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0"
                      aria-label="Copy outage incident ID"
                      title="Copy incident ID"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(selectedIncident.id);
                          setCopiedIncidentId(true);

                          window.setTimeout(() => setCopiedIncidentId(false), 2000);
                        } catch {
                          // Clipboard access may be unavailable.
                        }
                      }}
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
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
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
    </div>
  );
}
