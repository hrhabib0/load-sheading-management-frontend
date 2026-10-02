import type { UserRole } from "@/types/auth.type";
import { StatCard } from "./stat-card";
import { AlertTriangle, CalendarClock, MapPin, Zap } from "lucide-react";
import { ICustomerProfile, ICustomerReport } from "@/types/customer.type";
import { ILoadSheddingSchedule } from "@/types/load-shedding.type";
import { IMyAreaOutageStatus } from "@/types/outage-incident.type";
import { getPowerStatus } from "./Customer Dashboard/power-status";

interface DashboardContentProps {
    role: UserRole;
    customerProfile?: ICustomerProfile;
    customerReports?:ICustomerReport[];
    loadsheddingSchedules?: ILoadSheddingSchedule[];
    outageStatus?: IMyAreaOutageStatus
}

function CustomerDashboard(
    {
        customerProfile,
        customerReports=[],
        loadsheddingSchedules=[],
        outageStatus,
    }: {
        customerProfile?: ICustomerProfile,
        customerReports?: ICustomerReport[],
        loadsheddingSchedules?:ILoadSheddingSchedule[],
        outageStatus?: IMyAreaOutageStatus,
    }
) {

    const powerStatus = outageStatus?.status;

    const powerStatusDisplay = outageStatus?.isPowerAvailable ? {
        value: "Power Available",
        description: "Your area currently has power",
    } : getPowerStatus(powerStatus);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                     Welcome back, {customerProfile?.name}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Here's what's happening with your
                    electricity service.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Power Status"
                    value={powerStatusDisplay.value}
                    description={powerStatusDisplay.description}
                    icon={Zap}
                />

                <StatCard
                    title="Next Schedule"
                    value="10:00 AM"
                    description="Expected load shedding"
                    icon={CalendarClock}
                />

                <StatCard
                    title="Open Reports"
                    value= {
                                customerReports.filter(
                                    (report) => report.status === "PENDING",
                                ).length
                            }
                    description="Reports awaiting resolution"
                    icon={AlertTriangle}
                />
            </div>

            {/* Area */}
            <div className="rounded-xl border bg-background p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                        <MapPin className="size-5" />
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Your Area
                        </p>

                        <h2 className="font-semibold">
                            {customerProfile?.customerProfile.area.name}
                        </h2>
                    </div>
                </div>

                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                        <p className="text-muted-foreground">
                            Area Code
                        </p>

                        <p className="mt-1 font-medium">
                            {customerProfile?.customerProfile.area.code}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">
                            Service Priority
                        </p>

                        <p className="mt-1 font-medium">
                            {customerProfile?.customerProfile.priority.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Upcoming Load Shedding */}
            <div className="rounded-xl border bg-background shadow-sm">
                <div className="border-b p-5">
                    <h2 className="font-semibold">
                        Upcoming Load Shedding
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Your upcoming scheduled power
                        interruptions.
                    </p>
                </div>

                <div className="p-5">
                    {loadsheddingSchedules.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No upcoming load shedding is scheduled for your area.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {loadsheddingSchedules
                                .slice(0, 3)
                                .map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {schedule.title}
                                            </p>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {new Date(
                                                    schedule.scheduledStartAt,
                                                ).toLocaleString()}{" "}
                                                —{" "}
                                                {new Date(
                                                    schedule.scheduledEndAt,
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                            Scheduled
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Reports */}
            <div className="rounded-xl border bg-background shadow-sm">
                <div className="border-b p-5">
                    <h2 className="font-semibold">
                        Recent Reports
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Your recently submitted power
                        problem reports.
                    </p>
                </div>

                <div className="p-5">
                    {customerReports.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            You haven't submitted any reports yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {customerReports.slice(0, 3).map((report) => (
                                <div
                                    key={report.id}
                                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            {report.description}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {new Date(
                                                report.reportedAt,
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                                            report.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                : report.status === "LINKED"
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {getReportStatusLabel(report.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TechnicianDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold">
                Technician Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">
                View and manage your assigned work
                tasks.
            </p>
        </div>
    );
}

function OperatorDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold">
                Power Operator Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">
                Monitor outages, reports, tasks, and
                power operations.
            </p>
        </div>
    );
}

function ZoneManagerDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold">
                Zone Manager Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">
                Manage and monitor your assigned zone.
            </p>
        </div>
    );
}

function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold">
                Admin Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">
                Manage the entire system.
            </p>
        </div>
    );
}

export function DashboardContent({
    role,
    customerProfile,
    customerReports,
    loadsheddingSchedules,
    outageStatus
}: DashboardContentProps) {
    switch (role) {
        case "CUSTOMER":
            return <CustomerDashboard 
                customerProfile={customerProfile}
                customerReports={customerReports}
                loadsheddingSchedules={loadsheddingSchedules}
                outageStatus={outageStatus}
            />;

        case "TECHNICIAN":
            return <TechnicianDashboard />;

        case "POWER_OPERATOR":
            return <OperatorDashboard />;

        case "ZONE_MANAGER":
            return <ZoneManagerDashboard />;

        case "ADMIN":
            return <AdminDashboard />;

        default:
            return null;
    }
}

const getReportStatusLabel = (
    status: ICustomerReport["status"],
) => {
    switch (status) {
        case "PENDING":
            return "Under Review";

        case "LINKED":
            return "Linked to Outage";

        case "CANCELLED":
            return "Cancelled";
    }
};