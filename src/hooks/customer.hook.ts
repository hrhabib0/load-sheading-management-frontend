import { cancelCustomerReport, createCustomerReport, getMyCustomerProfile, getMyCustomerReports } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useGetMyCustomerProfile = () => {
    return useQuery({
        queryKey: ["customer-profile"],
        queryFn: getMyCustomerProfile,
        retry: false,
    });
};

export const useGetMyCustomerReports = (enabled = true) => {
    return useQuery({
        queryKey: ["my-customer-reports"],
        queryFn: getMyCustomerReports,
        enabled,
        retry: false,
    });
};

export const useCancelCustomerReport = () => {
  return useMutation({
    mutationFn: cancelCustomerReport,
  });
};

export const useCreateCustomerReport = () => {
  return useMutation({
    mutationFn: createCustomerReport,
  });
};