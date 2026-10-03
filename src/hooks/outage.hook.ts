import { getAllOutageIncidents, getAllPlannedOutages, getMyAreaOutageStatus } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetMyAreaOutageStatus = () => {
  return useQuery({
    queryKey: ["my-area-outage-status"],
    queryFn: getMyAreaOutageStatus,
    retry: false,
  });
};

export const useGetAllOutageIncidents = (enabled = true) => {
  return useQuery({
    queryKey: ["outage-incidents"],
    queryFn: getAllOutageIncidents,
    enabled,
    retry: false,
  });
};

export const useGetAllPlannedOutages = (enabled = true) => {
  return useQuery({
    queryKey: ["planned-outages"],
    queryFn: getAllPlannedOutages,
    enabled,
    retry: false,
  });
};