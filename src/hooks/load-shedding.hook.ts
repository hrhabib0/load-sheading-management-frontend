import { getMyAreaLoadSheddingSchedules } from "@/api";
import { useQuery } from "@tanstack/react-query";


export const useGetMyAreaLoadShedding = () => {
    return useQuery({
        queryKey: ["my-area-load-shedding"],
        queryFn: getMyAreaLoadSheddingSchedules,
        retry: false,
    });
};