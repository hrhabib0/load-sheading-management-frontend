import { getAllUsers } from "@/api/user.api";
import { IGetAllUsersParams } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsers = (params: IGetAllUsersParams) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => getAllUsers(params),
        retry: false,
    });
}
  