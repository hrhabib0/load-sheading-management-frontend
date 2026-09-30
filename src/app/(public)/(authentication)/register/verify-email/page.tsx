"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "@tanstack/react-form";



import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { verifyEmailSchema } from "@/validation";
import { useVerifyEmail } from "@/hooks";
import { toast } from "@/components/ui/toast";

export default function VerifyEmailPage() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    const {
        mutate: verifyEmail,
        isPending,
        error,
    } = useVerifyEmail();

    useEffect(() => {
        if (!email) {
            router.replace("/register");
        }
    }, [email, router]);

    const form = useForm({
        defaultValues: {
            otp: "",
        },

        validators: {
            onSubmit: verifyEmailSchema,
        },

        onSubmit: async ({ value }) => {
            if (!email) {
                return;
            }
            const data = {
                email,
                otp: value.otp,
            }
            verifyEmail(data, {
                onSuccess: (res)=>{
                    if (!res.success) {
                        toast.add({
                        title: "Server Failure",
                        description: "Something went wrong. Please try again",
                        type: "error",
                        });
                    }
                    toast.add({
                        title: "Registration Successful",
                        description: "Customer Registerd Successfully",
                        type: "success",
                    });
                    router.push("/login");
                },
                onError: (err) => {
                    toast.add({
                        title: "Failed",
                        description: err?.message || "Custmer Registration Failed.",
                        type: "error",
                    });
                }
            })
            
            // try {
            //     await mutateAsync({
            //         email,
            //         otp: value.otp,
            //     });

            //     router.push("/login");
            // } catch {
            //     // Backend error is handled below
            // }
        },
    });

    if (!email) {
        return null;
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        Verify your email
                    </CardTitle>

                    <CardDescription>
                        We sent a 6-digit verification
                        code to
                        <span className="mt-1 block font-medium text-foreground">
                            {email}
                        </span>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            void form.handleSubmit();
                        }}
                        className="space-y-6"
                    >
                        <form.Field name="otp">
                            {(field) => (
                                <Field>
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Verification code
                                    </FieldLabel>

                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        placeholder="Enter 6-digit OTP"
                                        value={
                                            field.state.value
                                        }
                                        onBlur={
                                            field.handleBlur
                                        }
                                        onChange={(event) => {
                                            const value =
                                                event.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                );

                                            field.handleChange(
                                                value,
                                            );
                                        }}
                                    />

                                    {field.state.meta
                                        .errors.length >
                                        0 && (
                                        <FieldError>
                                            {field.state.meta
                                                .errors[0]
                                                ?.message}
                                        </FieldError>
                                    )}
                                </Field>
                            )}
                        </form.Field>

                        {error && (
                            <p className="text-center text-sm text-destructive">
                                {error instanceof Error
                                    ? error.message
                                    : "Email verification failed"}
                            </p>
                        )}

                        <form.Subscribe
                            selector={(state) =>
                                state.canSubmit
                            }
                        >
                            {(canSubmit) => (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={
                                        !canSubmit ||
                                        isPending
                                    }
                                >
                                    {isPending
                                        ? "Verifying..."
                                        : "Verify email"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>

                    <div className="mt-6 border-t pt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Didn't receive the code?
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Check your spam folder or{" "}
                            <Link
                                href="/register"
                                className="font-medium text-primary hover:underline"
                            >
                                register again
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}