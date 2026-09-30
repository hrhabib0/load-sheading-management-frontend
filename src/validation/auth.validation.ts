import z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please provide a valid email address")
        .transform((value) => value.toLowerCase()),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerUserSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters"),

    email: z
        .string()
        .email("Please provide a valid email address")
        .transform((value) => value.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    phone: z
        .string()
        .optional(),

    areaId: z
        .string()
        .uuid("Invalid area ID"),
});

export const verifyEmailSchema = z.object({
    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
});