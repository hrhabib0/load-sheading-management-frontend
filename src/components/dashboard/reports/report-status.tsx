import { CustomerReportStatus } from "@/types/customer.type";

export function getReportStatus(
  status: CustomerReportStatus,
) {
  switch (status) {
    case "PENDING":
      return {
        label: "Under Review",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      };

    case "LINKED":
      return {
        label: "Linked to Outage",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className:
          "bg-muted text-muted-foreground",
      };

    default:
      return {
        label: status,
        className:
          "bg-muted text-muted-foreground",
      };
  }
}