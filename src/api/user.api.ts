import apiClient from "@/lib/apiClient";
import { IGetAllUsersParams, IGetAllUsersResponse } from "@/types/user.type";


export const getAllUsers = (params: IGetAllUsersParams = {}) => {
    return apiClient<IGetAllUsersResponse>("/users", {
        method: "GET",
        query: params,
    });
}
    