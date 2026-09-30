import type { UserRole } from "@/types/auth.type";

interface DashboardContentProps {
    role: UserRole;
}

function CustomerDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold">
                Customer Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">
                Monitor your electricity service,
                outages, and load-shedding schedules.
            </p>
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
}: DashboardContentProps) {
    switch (role) {
        case "CUSTOMER":
            return <CustomerDashboard />;

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