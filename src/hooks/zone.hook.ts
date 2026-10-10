import { getAllZones } from "@/api/zone.api";
import { useQuery } from "@tanstack/react-query";

export const useGetAllZones = (enabled = true) => {
    return useQuery({
        queryKey: ["zones"],
        queryFn: getAllZones,
        enabled,
        retry: false,
    });
}
  