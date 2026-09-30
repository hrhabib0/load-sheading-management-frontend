import { getMe, userLogin, userLogout, userRegister, verifyEmail } from "@/api"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useLogin = () => {
    return useMutation({
        mutationFn: userLogin
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: userRegister,
    })
}

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: verifyEmail
    });
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