import apiClient from "@/lib/apiClient"
import { ILoginPayload } from "@/types/auth.type"


export const userLogin = (payload: ILoginPayload) =>{
    return apiClient("/auth/login", {method: "POST", body: payload} )
}

export const getMe = () => {
    return apiClient("/auth/me");
}

export const userLogout = () => {
    return apiClient("/auth/logout", {method: "POST"});
}