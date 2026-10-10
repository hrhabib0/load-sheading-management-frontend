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
import { TechnicianDashboard } from "./technician/technician-dashboard";
import AdminDashboard from "./Admin/admin-dashboard";

interface DashboardContentProps {
    role: UserRole;
    customerProfile?: ICustomerProfile;
    customerReports?: ICustomerReport[];
    loadsheddingSchedules?: ILoadSheddingSchedule[];
    outageStatus?: IMyAreaOutageStatus
}

function OperatorDashboard() {
    return (
        <PowerOperatorDashboard />
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