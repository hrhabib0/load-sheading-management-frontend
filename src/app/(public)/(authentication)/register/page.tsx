"use client";

import Link from "next/link";

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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetAreas, useRegister } from "@/hooks";
import { registerUserSchema } from "@/validation";
import z, { email } from "zod";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  type CustomerDefaultValues = z.infer<typeof registerUserSchema>;

  const defaultValues : CustomerDefaultValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    areaId: "",
  }
    const { mutate:registration, isPending } = useRegister();

    const {
        data: areasResponse,
        isLoading: areasLoading,
    } = useGetAreas();

    const areas = areasResponse?.data ?? [];

    const form = useForm({
        defaultValues,
        validators: {
            onSubmit: registerUserSchema,
        },

        onSubmit: async ({ value }) => {
          const registrationData = {
            name: value.name,
            email: value.email,
            password: value.password,
            phone: value.phone,
            areaId: value.areaId,
          };
          registration(registrationData, {
            onSuccess: (res) => {
              if (!res.success) {
                toast.add({
                  title: "Server Failure",
                  description: "Something went wrong. Please try again",
                  type: "error",
                });
              }
              toast.add({
                title: "OTP Sent",
                description: "Please verify your account",
                type: "success",
              });
              const params = new URLSearchParams({ email: registrationData.email });
              router.push(`/register/verify-email?${params.toString()}`);
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
            //     const response = await mutateAsync({
            //         name: value.name,
            //         email: value.email,
            //         password: value.password,
            //         phone: value.phone || undefined,
            //         areaId: value.areaId,
            //     });

            //     console.log(
            //         "Registration successful:",
            //         response,
            //     );
            // } catch (error) {
            //     console.error(
            //         "Registration failed:",
            //         error,
            //     );
            // }
        },
    });

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        Create an account
                    </CardTitle>
                    
                    <CardDescription>
                        Create your PowerGrid account (Only for Customer)
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            void form.handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        {/* Name */}
                        <form.Field
                            name="name"
                        >
                            {(field) => (
                                <Field>
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Name
                                    </FieldLabel>

                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        placeholder="Your name"
                                        value={
                                            field.state.value
                                        }
                                        onBlur={
                                            field.handleBlur
                                        }
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target
                                                    .value,
                                            )
                                        }
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

                        {/* Email */}
                        <form.Field
                            name="email"
                        >
                            {(field) => (
                                <Field>
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Email
                                    </FieldLabel>

                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        value={
                                            field.state.value
                                        }
                                        onBlur={
                                            field.handleBlur
                                        }
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target
                                                    .value,
                                            )
                                        }
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

                        {/* Phone */}
                        <form.Field
                            name="phone"
                        >
                            {(field) => (
                                <Field>
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Phone
                                    </FieldLabel>

                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        value={
                                            field.state.value
                                        }
                                        onBlur={
                                            field.handleBlur
                                        }
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target
                                                    .value,
                                            )
                                        }
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

                        {/* Password */}
                        <form.Field
                            name="password"
                        >
                            {(field) => (
                                <Field>
                                    <FieldLabel
                                        htmlFor={field.name}
                                    >
                                        Password
                                    </FieldLabel>

                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="password"
                                        placeholder="Enter your password"
                                        autoComplete="new-password"
                                        value={
                                            field.state.value
                                        }
                                        onBlur={
                                            field.handleBlur
                                        }
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target
                                                    .value,
                                            )
                                        }
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

                        {/* Area */}
                        <form.Field
                            name="areaId"
                        >
                            {(field) => (
                                <Field>
                                    <FieldLabel>
                                        Area
                                    </FieldLabel>

                                    <Select
                                        value={
                                            field.state.value
                                        }
                                        onValueChange={(value) => {
                                          if(value !== null){
                                            field.handleChange(value);
                                          }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your area" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {areas.map(
                                                (area:any) => (
                                                    <SelectItem
                                                        key={
                                                            area.id
                                                        }
                                                        value={
                                                            area.id
                                                        }
                                                    >
                                                        {
                                                            area.name
                                                        }
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>

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

                        {/* Submit */}
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
                                        isPending ||
                                        areasLoading
                                    }
                                >
                                    {isPending
                                        ? "Creating account..."
                                        : "Create account"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>

                    <div className="mt-6 border-t pt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-primary hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
