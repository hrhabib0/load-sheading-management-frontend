import { FileText } from "lucide-react";

export function ReportStatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description?: string;
  icon: typeof FileText;
}) {
  return (
        <div className="
            group rounded-xl border bg-background p-5 shadow-sm
            transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:border-primary/30
            hover:shadow-lg hover:shadow-primary/5
        "
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                        </p>
                    )}
                </div>

                <div className="
                    rounded-lg bg-primary/10 p-2.5 text-primary
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:bg-primary
                    group-hover:text-primary-foreground
                "
                >
                    <Icon className="size-5 transition-transform duration-300 group-hover:rotate-3" />
                </div>
            </div>
        </div>
    );
}