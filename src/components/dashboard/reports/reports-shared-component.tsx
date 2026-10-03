import { AlertTriangle, FileText } from "lucide-react";

export function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}

export function ReportStatusBadge({
  status,
}: {
  status: {
    label: string;
    className: string;
  };
}) {
  return (
    <span
      className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
    >
      {status.label}
    </span>
  );
}

export function EmptyReports({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <FileText className="size-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function ReportsError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="size-5 text-destructive" />

        <div>
          <h2 className="font-semibold">
            Unable to load reports
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while retrieving {message}.
          </p>
        </div>
      </div>
    </div>
  );
}