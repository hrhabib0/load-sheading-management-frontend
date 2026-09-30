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