import apiClient from "@/lib/apiClient";
import { IReport } from "@/types/customer-report.type";

export const getAllCustomerReports = () => {
  return apiClient<{ data: IReport[] }>("/customer-reports", {
    method: "GET",
  });
};