
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Activity,
  ClipboardPlus,
  FileText,
  LoaderCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { useCreateWorkTask } from "@/hooks";

interface CreateWorkTaskDialogProps {
  incidentId: string;
  incidentLabel?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkTaskDialog({
  incidentId,
  incidentLabel,
  open,
  onOpenChange,
}: CreateWorkTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createWorkTaskMutation = useCreateWorkTask();
  const isPending = createWorkTaskMutation.isPending;

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      createWorkTaskMutation.reset();
    }
  }, [open, createWorkTaskMutation.reset]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      incidentId: incidentId.trim(),
      title: title.trim(),
      description: description.trim(),
    };

    if (
      !payload.incidentId ||
      !payload.title ||
      !payload.description ||
      isPending
    ) {
      toast.add({
        title: "Missing required information",
        description: "Please provide a task title and description.",
        type: "error",
      });
      return;
    }

    createWorkTaskMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.add({
          title: "Work task created",
          description:
            response?.message || "The work task was created successfully.",
          type: "success",
        });

        onOpenChange(false);
      },
      onError: (error) => {
        toast.add({
          title: "Failed to create work task",
          description:
            error instanceof Error
              ? error.message
              : "The request failed. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <div className="border-b bg-muted/30 px-6 py-5 sm:px-7">
          <DialogHeader className="gap-3 text-left">
            <div className="flex size-11 items-center justify-center rounded-xl border bg-background text-primary shadow-sm">
              <ClipboardPlus className="size-5" />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="text-xl tracking-tight">
                Create work task
              </DialogTitle>

              <DialogDescription className="leading-relaxed">
                Create an inspection or repair task for this outage incident.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-6 py-6 sm:px-7">
            {/* Selected incident */}
            <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Related outage incident
                </p>
                <p className="mt-1 break-all font-mono text-sm font-semibold">
                  {incidentLabel || incidentId}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The task will be associated with this incident.
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="work-task-title"
                  className="text-sm font-semibold"
                >
                  Task title <span className="text-destructive">*</span>
                </label>

                <span className="text-xs text-muted-foreground">
                  {title.length}/150
                </span>
              </div>

              <Input
                id="work-task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Inspect damaged distribution line"
                maxLength={150}
                required
                disabled={isPending}
              />

              <p className="text-xs text-muted-foreground">
                Use a short, action-oriented title.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="work-task-description"
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <FileText className="size-4 text-muted-foreground" />
                  Description <span className="text-destructive">*</span>
                </label>

                <span className="text-xs text-muted-foreground">
                  {description.length}/2000
                </span>
              </div>

              <Textarea
                id="work-task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the inspection, diagnosis, or repair required..."
                rows={5}
                maxLength={2000}
                required
                disabled={isPending}
                className="min-h-32 resize-y"
              />
            </div>

            <div className="flex gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3.5">
              <Activity className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Creating a task does not automatically change the incident
                status. Repair progress is managed separately.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse gap-2 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:px-7">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isPending ||
                !incidentId.trim() ||
                !title.trim() ||
                !description.trim()
              }
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Creating task...
                </>
              ) : (
                <>
                  <ClipboardPlus className="mr-2 size-4" />
                  Create work task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
