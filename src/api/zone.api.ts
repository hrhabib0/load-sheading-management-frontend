import apiClient from "@/lib/apiClient"
import { IZone } from "@/types/zone.type";

export const getAllZones = () => {
    return apiClient<{ data: IZone[] }>("/zones", {
    method: "GET",
  });
}