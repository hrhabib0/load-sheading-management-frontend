import { getMyCustomerProfile, getMyCustomerReports } from "@/api";
import { useQuery } from "@tanstack/react-query";


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