import { getAdminAnalyticsData } from "@/api"
import { useQuery } from "@tanstack/react-query"


export const useGetAdminAnalyticsData = () => {
    return useQuery({
        queryKey: ["admin-analytics"],
        queryFn: getAdminAnalyticsData,
        retry: false,
    })
}