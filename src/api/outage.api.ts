import apiClient from "@/lib/apiClient";
import { IMyAreaOutageStatus } from "@/types/outage-incident.type";

export const getMyAreaOutageStatus = () => {
  return apiClient <{ data: IMyAreaOutageStatus }>(
    "/outage-incidents/my-area",
    {
      method: "GET",
    },
  );
};