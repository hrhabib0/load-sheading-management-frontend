import apiClient from "@/lib/apiClient"

export const getAdminAnalyticsData = () => {
    return apiClient("/analytics/admin-analytics", {method: "GET"})
}