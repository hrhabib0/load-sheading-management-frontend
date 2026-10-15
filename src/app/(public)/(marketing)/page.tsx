import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  Users,
  Zap,
  MapPinned,
  RadioTower,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CTA from "@/components/layout/public/Cta";
import { Features } from "@/components/layout/public/Features";
import { ContactSection } from "@/components/layout/public/ContactUs";

const features = [
  {
    icon: CalendarClock,
    title: "Load Shedding Schedules",
    description:
      "Organize planned power interruptions with structured schedules, approval workflows, and customer notifications.",
    number: "01",
  },
  {
    icon: Zap,
    title: "Outage Management",
    description:
      "Track unexpected power interruptions from initial reports through repair, restoration, and closure.",
    number: "02",
  },
  {
    icon: Wrench,
    title: "Field Operations",
    description:
      "Assign work tasks to technicians, monitor repair progress, and coordinate restoration activities.",
    number: "03",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Give customers, operators, technicians, managers, and administrators access to the tools they need.",
    number: "04",
  },
  {
    icon: MapPinned,
    title: "Distribution Infrastructure",
    description:
      "Organize zones, substations, feeders, and service areas in a structured hierarchy.",
    number: "05",
  },
  {
    icon: Activity,
    title: "Operational Insights",
    description:
      "Build visibility into outage history, restoration performance, and distribution operations.",
    number: "06",
  },
];

const activities = [
  {
    title: "Feeder inspection",
    subtitle: "Dhaka North · Feeder 03",
    status: "In progress",
    color: "bg-blue-500",
  },
  {
    title: "Scheduled maintenance",
    subtitle: "Dhaka South · Feeder 01",
    status: "Scheduled",
    color: "bg-amber-500",
  },
  {
    title: "Restoration verification",
    subtitle: "Uttara · Feeder 02",
    status: "Under review",
    color: "bg-emerald-500",
  },
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-5 rounded-[2rem] bg-primary/5 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/5">
        {/* Preview top bar */}
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Power Operations
              </p>
              <p className="text-[11px] text-muted-foreground">
                System overview
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Dashboard preview
          </span>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          {/* Preview heading */}
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Operational overview
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              A unified view of distribution activities
            </p>
          </div>

          {/* Preview metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-background p-3">
              <div className="flex items-center justify-between">
                <MapPinned className="size-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">
                  Infrastructure
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">Zones</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Distribution network
              </p>
            </div>

            <div className="rounded-xl border bg-background p-3">
              <div className="flex items-center justify-between">
                <Zap className="size-4 text-amber-500" />
                <span className="text-[10px] text-muted-foreground">
                  Monitoring
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">Outages</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Incident tracking
              </p>
            </div>

            <div className="col-span-2 rounded-xl border bg-background p-3 sm:col-span-1">
              <div className="flex items-center justify-between">
                <Wrench className="size-4 text-emerald-600" />
                <span className="text-[10px] text-muted-foreground">
                  Field team
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">Tasks</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Repair coordination
              </p>
            </div>
          </div>

          {/* Preview activity list */}
          <div className="rounded-xl border">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold">
                Operational activity
              </p>
              <Activity className="size-4 text-muted-foreground" />
            </div>

            <div className="divide-y">
              {activities.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${activity.color}`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {activity.title}
                    </p>
                    <p className="mt-1 truncate text-[10px] text-muted-foreground">
                      {activity.subtitle}
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            <span>
              Structured workflows for more coordinated operations.
            </span>
          </div>
        </div>
      </div>

      {/* Decorative floating card */}
      <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-xl border bg-card p-3 shadow-lg sm:flex sm:-left-8">
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold">Workflow visibility</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            From report to resolution
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative border-b">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--primary)_0%,transparent_42%)] opacity-[0.07]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                <RadioTower className="size-3" />
              </span>
              Electricity distribution management
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </div>

            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Better visibility.
              <br />
              <span className="text-primary">
                Smarter power operations.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              A centralized platform to manage load-shedding
              schedules, track power outages, coordinate field teams,
              and organize electricity distribution operations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/login" />}
                className="h-12 px-6"
              >
                Get Started
                <ArrowRight className="size-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/about-us" />}
                className="h-12 px-6"
              >
                Explore the platform
                <ArrowUpRight className="size-4" />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                Role-based access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                Structured workflows
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                Centralized management
              </span>
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      {/* Trust / positioning strip */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-sm font-medium">
            One platform for the entire operational workflow
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarClock className="size-4" />
              Scheduling
            </span>
            <span className="flex items-center gap-2">
              <Zap className="size-4" />
              Incident tracking
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              Team coordination
            </span>
            <span className="flex items-center gap-2">
              <ClipboardList className="size-4" />
              Operational history
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* How it works */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold text-primary">
              CONNECTED OPERATIONS
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From the first report to verified restoration
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Keep each step visible and accountable. Reports can be
              reviewed, work can be assigned, and restoration can be
              verified through a structured operational process.
            </p>

            <Button
              className="mt-6"
              variant="outline"
              nativeButton={false}
              render={<Link href="/about-us" />}
            >
              Learn how it works
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {[
              {
                step: "01",
                title: "Report and identify",
                description:
                  "Record a power problem and identify the affected distribution area.",
              },
              {
                step: "02",
                title: "Assign and resolve",
                description:
                  "Coordinate technicians and track repair tasks through completion.",
              },
              {
                step: "03",
                title: "Verify restoration",
                description:
                  "Confirm restoration and preserve the incident's operational history.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-xl border bg-card p-5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {item.step}
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <ContactSection />

      {/* CTA */}
      <CTA />
    </main>
  );
}