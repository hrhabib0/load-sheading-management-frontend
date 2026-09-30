import apiClient from "@/lib/apiClient"

export const getAllArea = () => {
    return apiClient("/areas/customer-area", {method: "GET"});
}