import apiClient from "@/lib/apiClient";
import { ICreateCustomerReportPayload } from "@/types/customer.type";


export const getMyCustomerProfile = () => {
    return apiClient("/customers/me", {
        method: "GET",
    });
};

export const getMyCustomerReports = () => {
    return apiClient("/customer-reports/my-reports", {
        method: "GET",
    });
};

export const createCustomerReport = (
  payload: ICreateCustomerReportPayload,
) => {
  return apiClient("/customer-reports/create-report", {
    method: "POST",
    body: payload,
  });
};

export const cancelCustomerReport = (reportId: string) => {
  return apiClient(`/customer-reports/${reportId}/cancel`, {
    method: "PATCH",
  });
};
