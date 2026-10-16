import { getAllOutageIncidents, getAllPlannedOutages, getMyAreaOutageStatus, linkCustomerReport } from "@/api";
import { ILinkCustomerReportVariables } from "@/types/outage-incident.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useLinkCustomerReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      payload,
    }: ILinkCustomerReportVariables) =>
      linkCustomerReport(incidentId, payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-customer-reports"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customer-reports"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["outage-incidents"],
        }),
      ]);
    },
  });
};