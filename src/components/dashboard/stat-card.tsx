import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: StatCardProps) {
    return (
        <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
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

                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}