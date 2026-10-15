"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/validation";

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: async ({ value }) => {
      setLoginError(null);

      login(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Welcome back!",
              description: "You have successfully signed in to PowerGrid.",
              type: "success",
            });

            router.replace("/");
          },

          onError: (error) => {
            const message =
              error.message ||
              "Invalid email or password. Please try again.";

            setLoginError(message);

            toast.add({
              title: "Login failed",
              description: message,
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* Left: Brand panel */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r bg-muted/30 p-10 lg:flex xl:p-14">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 size-[30rem] rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[56px_56px] opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
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

        {/* Main message */}
        <div className="relative z-10 max-w-xl py-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3.5 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>

            Smarter power management
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl xl:leading-[1.15]">
            Reliable information.
            <span className="mt-2 block text-primary">
              Better power operations.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground xl:text-lg xl:leading-8">
            Manage outages, coordinate field operations, and stay
            informed about electricity service updates—all in one
            centralized platform.
          </p>

          {/* Feature cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-background/70 p-5 shadow-sm backdrop-blur">
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Activity size={21} />
              </div>

              <h2 className="font-semibold">
                Operational visibility
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Track outage reports, restoration progress, and
                planned interruptions.
              </p>
            </div>

            <div className="rounded-2xl border bg-background/70 p-5 shadow-sm backdrop-blur">
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck size={21} />
              </div>

              <h2 className="font-semibold">
                Role-based access
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Give each user access to the tools and information
                relevant to their responsibilities.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
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

      {/* Right: Login form */}
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

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border bg-primary/5 text-primary">
                <LockKeyhole size={23} />
              </div>

              <p className="text-sm font-medium text-primary">
                YOUR POWERGRID ACCOUNT
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Sign in to access your account and continue where
                you left off.
              </p>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void form.handleSubmit();
                }}
                className="space-y-5"
              >
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
                        onChange={(event) => {
                          field.handleChange(event.target.value);
                          setLoginError(null);
                        }}
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

                {/* Password */}
                <form.Field name="password">
                  {(field) => (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor={field.name}>
                          Password
                        </Label>

                        <Link
                          href="/forgot-password"
                          className="text-xs font-medium text-primary transition-colors hover:text-primary/80 hover:underline sm:text-sm"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          required
                          disabled={isPending}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            field.handleChange(event.target.value);
                            setLoginError(null);
                          }}
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

                {/* Server error */}
                {loginError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  >
                    {loginError}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 w-full gap-2 font-semibold"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to PowerGrid
                      <ArrowRight size={17} />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                  By signing in, you agree to use PowerGrid
                  responsibly and in accordance with applicable
                  policies.
                </p>
              </form>

              {/* Register */}
              <div className="mt-6 border-t pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            {/* Bottom links */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ArrowLeft size={13} />
                  Back to home
                </span>
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