import {
    Bell,
    CalendarClock,
    ClipboardList,
    CreditCard,
    FileWarning,
    LayoutDashboard,
    Map as MapIcon,
    Settings,
    Users,
    Wrench,
    Zap,
} from "lucide-react";

export type UserRole =
    | "CUSTOMER"
    | "POWER_OPERATOR"
    | "ZONE_MANAGER"
    | "ADMIN";

export const dashboardNavigation = {
    CUSTOMER: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Load Shedding",
            href: "/dashboard/schedule",
            icon: CalendarClock,
        },
        {
            title: "Outages",
            href: "/dashboard/outages",
            icon: Zap,
        },
        {
            title: "Report Problem",
            href: "/dashboard/reports/create",
            icon: FileWarning,
        },
        {
            title: "My Reports",
            href: "/dashboard/reports",
            icon: ClipboardList,
        },
        {
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
        },
        {
            title: "Payments",
            href: "/dashboard/payments",
            icon: CreditCard,
        },
    ],

    TECHNICIAN: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "My Tasks",
            href: "/dashboard/tasks",
            icon: Wrench,
        },
        {
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
        },
    ],

    POWER_OPERATOR: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Outage Incidents",
            href: "/dashboard/incidents",
            icon: Zap,
        },
        {
            title: "Customer Reports",
            href: "/dashboard/reports",
            icon: FileWarning,
        },
        {
            title: "Work Tasks",
            href: "/dashboard/tasks",
            icon: Wrench,
        },
        {
            title: "Planned Outages",
            href: "/dashboard/planned-outages",
            icon: CalendarClock,
        },
        {
            title: "Load Shedding",
            href: "/dashboard/load-shedding",
            icon: Zap,
        },
        {
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
        },
    ],

    ZONE_MANAGER: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Outage Incidents",
            href: "/dashboard/incidents",
            icon: Zap,
        },
        {
            title: "Customer Reports",
            href: "/dashboard/reports",
            icon: FileWarning,
        },
        {
            title: "Work Tasks",
            href: "/dashboard/tasks",
            icon: Wrench,
        },
        {
            title: "Planned Outages",
            href: "/dashboard/planned-outages",
            icon: CalendarClock,
        },
        {
            title: "Load Shedding",
            href: "/dashboard/load-shedding",
            icon: Zap,
        },
    ],

    ADMIN: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Users",
            href: "/dashboard/users",
            icon: Users,
        },
        {
            title: "Zones",
            href: "/dashboard/zones",
            icon: Map,
        },
        {
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ],
};