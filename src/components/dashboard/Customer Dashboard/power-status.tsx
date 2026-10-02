import { CustomerPowerStatus } from "@/types/outage-incident.type";

export const getPowerStatus = (status?: CustomerPowerStatus) => {
  switch (status) {
    case "INVESTIGATING":
      return {
        value: "Investigating",
        description: "We're investigating the power issue",
      };

    case "REPAIRING":
      return {
        value: "Repairing",
        description: "Technicians are working to restore power",
      };

    case "RESTORATION_PENDING":
      return {
        value: "Restoration Pending",
        description: "Repair is complete and restoration is being verified",
      };

    default:
      return {
        value: "Power Available",
        description: "Your area currently has power",
      };
  }
};