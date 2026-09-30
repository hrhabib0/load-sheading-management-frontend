import { getAllArea } from "@/api"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetAreas = () => {
    return useQuery({
        queryKey: ["areas"],
        queryFn: getAllArea,
    })
}