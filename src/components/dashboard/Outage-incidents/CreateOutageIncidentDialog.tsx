"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, LoaderCircle, Zap } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";

type Feeder = {
  id: string;
  name: string;
  code?: string | null;
  isActive?: boolean;
  substation?: {
    name?: string;
    zone?: {
      name?: string;
    } | null;
  } | null;
};

type CreateIncidentPayload = {
  feederId: string;
  description: string;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateOutageIncidentDialog({
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();

  const [feederId, setFeederId] = useState("");
  const [description, setDescription] = useState("");

  const feedersQuery = useQuery({
    queryKey: ["feeders"],
    queryFn: () =>
      apiClient<ApiResponse<Feeder[]>>("/feeders"),
    enabled: open,
  });

  const createIncidentMutation = useMutation({
    mutationFn: (payload: CreateIncidentPayload) =>
      apiClient("/outage-incidents", {
        method: "POST",
        body: payload,
      }),
    onSuccess: async () => {
      toast.add({
        title: "Incident created",
        description: "The outage incident has been recorded successfully.",
        type: "success",
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["outage-incidents"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customer-reports"],
        }),
      ]);

      setFeederId("");
      setDescription("");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.add({
        title: "Unable to create incident",
        description: error.message || "Please try again.",
        type: "error",
      });
    },
  });

  useEffect(() => {
    if (!open) {
      setFeederId("");
      setDescription("");
      createIncidentMutation.reset();
    }
  }, [open, createIncidentMutation.reset]);

  const feeders = (feedersQuery.data?.data ?? []).filter(
    (feeder) => feeder.isActive !== false,
  );

  const isPending = createIncidentMutation.isPending;
  const isDescriptionValid =
    description.trim().length >= 10 &&
    description.trim().length <= 1000;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!feederId) {
      toast.add({
        title: "Select a feeder",
        description: "Choose the feeder affected by the outage.",
        type: "error",
      });
      return;
    }

    if (!isDescriptionValid || isPending) return;

    createIncidentMutation.mutate({
      feederId,
      description: description.trim(),
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Zap className="size-5" />
          </div>

          <DialogTitle className="text-xl">
            Create outage incident
          </DialogTitle>

          <DialogDescription>
            Record an unexpected power interruption so the operations team can
            investigate and coordinate restoration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="incident-feeder"
              className="text-sm font-medium"
            >
              Affected feeder <span className="text-destructive">*</span>
            </label>

            <select
              id="incident-feeder"
              value={feederId}
              onChange={(event) => setFeederId(event.target.value)}
              disabled={
                feedersQuery.isLoading ||
                feedersQuery.isError ||
                isPending
              }
              required
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {feedersQuery.isLoading
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

            {feedersQuery.isError && (
              <p className="text-sm text-destructive">
                Unable to load feeders. Close this dialog and try again.
              </p>
            )}

            {!feedersQuery.isLoading &&
              !feedersQuery.isError &&
              feeders.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No active feeders are available.
                </p>
              )}
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
              placeholder="Describe the interruption, suspected cause, or affected infrastructure..."
              rows={5}
              maxLength={1000}
              required
              disabled={isPending}
              className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="flex justify-between gap-3 text-xs text-muted-foreground">
              <span>Enter between 10 and 1,000 characters.</span>
              <span className="shrink-0">
                {description.length}/1000
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              A new incident starts as <strong>Investigating</strong>.
              Restoration must be verified before the incident is closed.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isPending ||
                feedersQuery.isLoading ||
                feedersQuery.isError ||
                feeders.length === 0 ||
                !feederId ||
                !isDescriptionValid
              }
            >
              {isPending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 size-4" />
                  Create incident
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}