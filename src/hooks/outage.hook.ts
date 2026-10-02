import { getMyAreaOutageStatus } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetMyAreaOutageStatus = () => {
  return useQuery({
    queryKey: ["my-area-outage-status"],
    queryFn: getMyAreaOutageStatus,
    retry: false,
  });
};