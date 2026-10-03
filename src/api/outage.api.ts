import apiClient from "@/lib/apiClient";
import { IMyAreaOutageStatus, IOutageIncident, IPlannedOutage } from "@/types/outage-incident.type";

export const getMyAreaOutageStatus = () => {
  return apiClient <{ data: IMyAreaOutageStatus }>(
    "/outage-incidents/my-area",
    {
      method: "GET",
    },
  );
};

// power-operator
export const getAllOutageIncidents = () => {
  return apiClient<{ data: IOutageIncident[] }>(
    "/outage-incidents",
    {
      method: "GET",
    },
  );
};

export const getAllPlannedOutages = () => {
  return apiClient<{ data: IPlannedOutage[] }>("/planned-outages", {
    method: "GET",
  });
};