"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  UserPlus,
  Zap,
} from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useGetAreas, useRegister } from "@/hooks";
import { registerUserSchema } from "@/validation";

type RegisterFormValues = z.infer<typeof registerUserSchema>;

const defaultValues: RegisterFormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  areaId: "",
};

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: registration, isPending } = useRegister();

  const {
    data: areasResponse,
    isLoading: areasLoading,
    isError: areasError,
  } = useGetAreas();

  const areas = areasResponse?.data ?? [];

  const form = useForm({
    defaultValues,

    validators: {
      onSubmit: registerUserSchema,
    },

    onSubmit: async ({ value }) => {
      const registrationData = {
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password,
        phone: value.phone?.trim() ?? "",
        areaId: value.areaId,
      };

      registration(registrationData, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Registration failed",
              description: "Unable to create your account. Please try again.",
              type: "error",
            });

            return;
          }

          toast.add({
            title: "Verification email requested",
            description: "Continue to verify your email address.",
            type: "success",
          });

          const params = new URLSearchParams({
            email: registrationData.email,
          });

          router.push(`/register/verify-email?${params.toString()}`);
        },
      onError: (error) => {
        toast.add({
          title: "Registration failed",
          description: error.message || "Please try again later.",
          type: "error",
        });
      },

      });
    },
  });

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* Desktop brand panel */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r bg-muted/30 p-10 lg:flex xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute -bottom-40 -right-24 size-120 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[56px_56px] opacity-20 mask-[linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>

        {/* Brand */}
        <Link
          href="/"
          className="relative z-10 inline-flex w-fit items-center gap-3"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Zap size={24} fill="currentColor" />
          </span>

          <span className="text-2xl font-bold tracking-tight">
            PowerGrid
          </span>
        </Link>

        {/* Main content */}
        <div className="relative z-10 max-w-xl py-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3.5 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <UserPlus size={16} className="text-primary" />
            Join the PowerGrid community
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl xl:leading-[1.15]">
            Stay connected.
            <span className="mt-2 block text-primary">
              Stay informed.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground xl:text-lg xl:leading-8">
            Create your customer account to access relevant outage
            information, follow service updates, and stay informed
            about electricity interruptions in your area.
          </p>

          {/* Benefits */}
          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-4 rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Activity size={20} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Stay up to date
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  View load-shedding schedules and relevant outage
                  updates for your service area.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Choose your service area
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Select your area during registration so the
                  platform can associate you with the relevant
                  service information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Verify your account
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Complete email verification to continue with
                  account setup.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop footer */}
        <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} PowerGrid</span>

          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy policy
          </Link>
        </div>
      </section>

      {/* Registration panel */}
      <section className="relative flex min-h-screen flex-col">
        {/* Mobile brand */}
        <div className="flex items-center justify-between p-5 sm:p-8 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Zap size={22} fill="currentColor" />
            </span>

            <span className="text-xl font-bold tracking-tight">
              PowerGrid
            </span>
          </Link>

          <Link
            href="/"
            aria-label="Back to home"
            className="flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-lg">
            {/* Heading */}
            <div className="mb-7">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border bg-primary/5 text-primary">
                <UserPlus size={23} />
              </div>

              <p className="text-sm font-medium text-primary">
                CREATE YOUR ACCOUNT
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Get started with PowerGrid
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Register as a customer to access electricity
                service information for your area.
              </p>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void form.handleSubmit();
                }}
                className="space-y-4"
              >
                {/* Full name */}
                <form.Field name="name">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Full name
                      </Label>

                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        disabled={isPending}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        className="h-11"
                      />

                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Email */}
                <form.Field name="email">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Email address
                      </Label>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        required
                        disabled={isPending}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        className="h-11"
                      />

                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Phone */}
                <form.Field name="phone">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Phone number
                      </Label>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        autoComplete="tel"
                        required
                        disabled={isPending}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        className="h-11"
                      />

                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Area */}
                <form.Field name="areaId">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="areaId">
                        Service area
                      </Label>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          if (value !== null) {
                            field.handleChange(value);
                          }
                        }}
                        disabled={
                          areasLoading ||
                          areasError ||
                          isPending
                        }
                      >
                        <SelectTrigger
                          id="areaId"
                          aria-label="Service area"
                          className="h-11 w-full"
                        >
                          <SelectValue
                            placeholder={
                              areasLoading
                                ? "Loading service areas..."
                                : areasError
                                  ? "Unable to load areas"
                                  : "Select your service area"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent>
                          {areas.map((area:any) => (
                            <SelectItem
                              key={area.id}
                              value={area.id}
                            >
                              {area.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {areasLoading && (
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <LoaderCircle
                            size={13}
                            className="animate-spin"
                          />
                          Fetching available service areas...
                        </p>
                      )}

                      {areasError && (
                        <p className="text-sm text-destructive">
                          Could not load service areas. Please
                          refresh the page and try again.
                        </p>
                      )}

                      {!areasLoading &&
                        !areasError &&
                        areas.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No service areas are currently available.
                          </p>
                        )}

                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Password */}
                <form.Field name="password">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Password
                      </Label>

                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          autoComplete="new-password"
                          required
                          disabled={isPending}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          className="h-11 pr-11"
                        />

                        <button
                          type="button"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          aria-pressed={showPassword}
                          onClick={() =>
                            setShowPassword((visible) => !visible)
                          }
                          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Privacy note */}
                <p className="text-xs leading-5 text-muted-foreground">
                  By creating an account, you acknowledge our{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>

                {/* Submit */}
                <form.Subscribe
                  selector={(state) => state.canSubmit}
                >
                  {(canSubmit) => (
                    <Button
                      type="submit"
                      size="lg"
                      className="h-11 w-full gap-2 font-semibold"
                      disabled={
                        !canSubmit ||
                        isPending ||
                        areasLoading ||
                        areasError ||
                        areas.length === 0
                      }
                    >
                      {isPending ? (
                        <>
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                          Creating your account...
                        </>
                      ) : (
                        <>
                          Create customer account
                          <ArrowRight size={17} />
                        </>
                      )}
                    </Button>
                  )}
                </form.Subscribe>
              </form>

              {/* Login link */}
              <div className="mt-6 border-t pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <ArrowLeft size={13} />
                Back to home
              </Link>

              <span aria-hidden="true" className="text-border">
                |
              </span>

              <Link
                href="/contact-us"
                className="transition-colors hover:text-foreground"
              >
                Need help?
              </Link>

              <span aria-hidden="true" className="text-border">
                |
              </span>

              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile copyright */}
        <div className="border-t px-5 py-4 text-center text-xs text-muted-foreground lg:hidden">
          © {new Date().getFullYear()} PowerGrid. All rights reserved.
        </div>
      </section>
    </main>
  );
}