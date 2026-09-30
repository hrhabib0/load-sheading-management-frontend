"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/validation";
import { useLogin } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";



export default function LoginPage() {

    const router = useRouter();
    const { mutate:login, isPending } = useLogin();

    const form = useForm({
        defaultValues: {
            email: "tester@tecnician.com",
            password: "Technician@12345",
        },

        validators: {
            onSubmit: loginSchema,
        },

        onSubmit: async ({ value }) => {
            const loginData = {
                email: value.email,
                password: value.password,
            };
            login(loginData, {
                onSuccess : (res)=>{
                    toast.add({
                        title: "Login Success",
                        description: `User logged in successfully.`,
                        type: "success"
                    });
                    router.push("/");
                },
                onError: (err)=>{
                    toast.add({
                        title: "Authorization failure",
                        description: err.message || "Something went wrong. Please try again",
                        type: "error"
                    });
                }
            })
        },
    });

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to your PowerGrid account
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            form.handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <form.Field
                            name="email"
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>
                                        Email
                                    </Label>

                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value,
                                            )
                                        }
                                    />

                                    {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                </p>
            )}
                                </div>
                            )}
                        </form.Field>

                        {/* Password */}
                        <form.Field
                            name="password"
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor={field.name}>
                                            Password
                                        </Label>

                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="password"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value,
                                            )
                                        }
                                    />

                                    {field.state.meta.errors.length > 0 && (
    <p className="text-sm text-destructive">
        {field.state.meta.errors[0]?.message}
    </p>
)}
                                </div>
                            )}
                        </form.Field>

                        {/* Submit */}
                        <form.Subscribe>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={
                                        isPending
                                    }
                                >
                                    {isPending
                                        ? "Logging in..."
                                        : "Login"}
                                </Button>
                        </form.Subscribe>
                    </form>

                    {/* Register */}
                    <div className="mt-6 border-t pt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-primary hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}