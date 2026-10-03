import apiClient from "@/lib/apiClient";
import { INotification } from "@/types/notification.type";

export const getMyNotifications = () => {
  return apiClient<{ data: INotification[] }>(
    "/notifications/my-notifications",
    {
      method: "GET",
    },
  );
};