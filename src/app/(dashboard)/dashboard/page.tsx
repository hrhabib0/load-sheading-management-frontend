export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Dashboard
                </h1>

                <p className="text-muted-foreground">
                    Welcome back. Here's what's
                    happening with your electricity
                    service.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">
                        Current Status
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        Normal
                    </p>
                </div>

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">
                        Next Load Shedding
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        No schedule
                    </p>
                </div>

                <div className="rounded-xl border bg-background p-5 sm:col-span-2 lg:col-span-1">
                    <p className="text-sm text-muted-foreground">
                        Open Reports
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        0
                    </p>
                </div>
            </div>
        </div>
    );
}