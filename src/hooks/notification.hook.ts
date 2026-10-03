import { getMyNotifications, markNotificationAsRead } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useGetMyNotifications = (enabled = true) => {
  return useQuery({
    queryKey: ["my-notifications"],
    queryFn: getMyNotifications,
    enabled,
    retry: false,
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: markNotificationAsRead,
  });
};