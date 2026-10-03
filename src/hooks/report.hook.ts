import { getAllCustomerReports } from "@/api/report.api";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCustomerReports = (enabled = true) => {
  return useQuery({
    queryKey: ["customer-reports"],
    queryFn: getAllCustomerReports,
    enabled,
    retry: false,
  });
};