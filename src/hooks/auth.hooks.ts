import { getMe, userLogin, userLogout } from "@/api"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useLogin = () => {
    return useMutation({
        mutationFn: userLogin
    })
}

export const useGetMe = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        retry: false
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: userLogout
    })
}