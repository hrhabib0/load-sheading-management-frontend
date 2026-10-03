"use client";

import { useRouter } from "next/navigation";
import { FileWarning, Info } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { useCreateCustomerReport } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const createCustomerReportSchema = z.object({
  description: z
    .string()
    .min(10, "Please describe the problem in at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters."),
});

export default function CreateCustomerReportPage() {
  const router = useRouter();

  const createReportMutation = useCreateCustomerReport();

  const form = useForm({
    defaultValues: {
      description: "",
    },

    validators: {
      onSubmit: createCustomerReportSchema,
    },

    onSubmit: async ({ value }) => {
      createReportMutation.mutate(value, {
        onSuccess: () => {
          router.push("/dashboard/reports");
        },
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <FileWarning className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Report a Problem
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Report an unexpected electricity problem in your area.
            </p>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="flex gap-3 rounded-xl border bg-muted/30 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" />

        <div className="text-sm">
          <p className="font-medium">Before submitting</p>

          <p className="mt-1 text-muted-foreground">
            Describe the electricity problem clearly. Your report will be
            reviewed by the power operations team.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border bg-background p-5 shadow-sm sm:p-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
            <form.Field
            name="description"
            >
                {(field) => (
                    <div className="space-y-2">
                        <label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                        >
                        Problem Description
                        </label>

                        <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(event) =>
                            field.handleChange(event.target.value)
                        }
                        onBlur={field.handleBlur}
                        placeholder="Example: There has been no electricity in our area since 8:30 PM."
                        rows={6}
                        disabled={createReportMutation.isPending}
                        />

                        <div className="flex items-center justify-between gap-4">
                        <div>
                            {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive">
                                {field.state.meta.errors[0]?.message}
                            </p>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {field.state.value.length}/500
                        </p>
                        </div>
                    </div>
                )}
            </form.Field>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={createReportMutation.isPending}
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending
                ? "Submitting..."
                : "Submit Report"}
            </Button>
          </div>

          {createReportMutation.isError && (
            <p className="text-sm text-destructive">
              {createReportMutation.error?.message ??
                "Failed to submit the report. Please try again."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}