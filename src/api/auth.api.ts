import apiClient from "@/lib/apiClient"
import { ILoginPayload, IRegisterUserPayload, IVerifyEmailPayload } from "@/types/auth.type"


export const userLogin = (payload: ILoginPayload) =>{
    return apiClient("/auth/login", {method: "POST", body: payload} )
}

export const userRegister = (payload: IRegisterUserPayload) => {
    return apiClient("/auth/register", {
        method: "POST", body: payload
    });
}

export const verifyEmail = (payload: IVerifyEmailPayload) => {
    return apiClient("/auth/verify-email", {
        method: "POST",
        body: payload,
    });
}

export const getMe = () => {
    return apiClient("/auth/me");
}

export const userLogout = () => {
    return apiClient("/auth/logout", {method: "POST"});
}