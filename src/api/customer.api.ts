import apiClient from "@/lib/apiClient";


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