export interface ILoginPayload {
    email: string;
    password: string;
}

export interface IRegisterUserPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
    areaId: string;
}

export interface IVerifyEmailPayload {
    email: string;
    otp: string;
}

export type UserRole =
    | "CUSTOMER"
    | "POWER_OPERATOR"
    | "ZONE_MANAGER"
    | "ADMIN";

export interface ICurrentUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
}