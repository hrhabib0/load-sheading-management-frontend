import type { UserRole } from "@/types/auth.type";
import { StatCard } from "./stat-card";
import { AlertTriangle, CalendarClock, MapPin, Power, Zap } from "lucide-react";
import { ICustomerProfile, ICustomerReport } from "@/types/customer.type";
import { ILoadSheddingSchedule } from "@/types/load-shedding.type";
import { IMyAreaOutageStatus } from "@/types/outage-incident.type";
import { getPowerStatus } from "./Customer Dashboard/power-status";
import { PowerOperatorDashboard } from "./power operator/power-operator-dashboard";
import { ZoneManagerDashboard } from "./zone manager/zone-manager-dashboard";
import { CustomerDashboard } from "./Customer Dashboard/customer-dashboard";

interface DashboardContentProps {
    role: UserRole;
    customerProfile?: ICustomerProfile;
    customerReports?: ICustomerReport[];
    loadsheddingSchedules?: ILoadSheddingSchedule[];
    outageStatus?: IMyAreaOutageStatus
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
        <PowerOperatorDashboard />
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

export const getReportStatusLabel = (
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