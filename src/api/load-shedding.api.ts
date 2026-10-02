import apiClient from "@/lib/apiClient";


export const getMyAreaLoadSheddingSchedules = () => {
    return apiClient(
        "/load-shedding/schedules/my-area",
        {
            method: "GET",
        },
    );
};