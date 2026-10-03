import { getMyNotifications } from "@/api";
import { useQuery } from "@tanstack/react-query";


export const useGetMyNotifications = (enabled = true) => {
  return useQuery({
    queryKey: ["my-notifications"],
    queryFn: getMyNotifications,
    enabled,
    retry: false,
  });
};