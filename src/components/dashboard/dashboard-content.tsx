import type { UserRole } from "@/types/auth.type";
import { ICustomerProfile, ICustomerReport } from "@/types/customer.type";
import { ILoadSheddingSchedule } from "@/types/load-shedding.type";
import { IMyAreaOutageStatus } from "@/types/outage-incident.type";
import { PowerOperatorDashboard } from "./power operator/power-operator-dashboard";
import { ZoneManagerDashboard } from "./zone manager/zone-manager-dashboard";
import CustomerDashboardPage from "./Customer Dashboard/customer-dashboard";
import { TechnicianDashboard } from "./technician/technician-dashboard";
import AdminDashboard from "./Admin/admin-dashboard";

interface DashboardContentProps {
    role: UserRole;
    customerProfile?: ICustomerProfile;
    customerReports?: ICustomerReport[];
    loadsheddingSchedules?: ILoadSheddingSchedule[];
    outageStatus?: IMyAreaOutageStatus
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
            return <CustomerDashboardPage />;

        case "TECHNICIAN":
            return <TechnicianDashboard />;

        case "POWER_OPERATOR":
            return <PowerOperatorDashboard />;

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