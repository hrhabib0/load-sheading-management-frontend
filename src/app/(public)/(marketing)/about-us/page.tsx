import Link from "next/link";
import {
  ArrowRight,
  Activity,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  MapPinned,
  ShieldCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CTA from "@/components/layout/public/Cta";
import { Features } from "@/components/layout/public/Features";

const capabilities = [
  {
    icon: CalendarClock,
    title: "Load Shedding Management",
    description:
      "Organize load-shedding schedules with structured planning, review, approval, and publication workflows.",
  },
  {
    icon: Zap,
    title: "Outage Incident Management",
    description:
      "Track unexpected power interruptions from investigation through repair, restoration verification, and closure.",
  },
  {
    icon: Wrench,
    title: "Technician Coordination",
    description:
      "Assign work tasks, monitor progress, and coordinate field operations through a defined workflow.",
  },
  {
    icon: MapPinned,
    title: "Distribution Infrastructure",
    description:
      "Organize zones, substations, feeders, and service areas to maintain a structured view of the distribution network.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description:
      "Provide customers, technicians, operators, zone managers, and administrators with appropriate system access.",
  },
  {
    icon: ShieldCheck,
    title: "Operational Accountability",
    description:
      "Maintain clear operational statuses, restoration verification, and records of important actions.",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Plan and organize",
    description:
      "Manage distribution infrastructure and prepare load-shedding or planned-outage schedules.",
    icon: CalendarClock,
  },
  {
    number: "02",
    title: "Report and coordinate",
    description:
      "Record unexpected problems, create incidents, and assign repair tasks to technicians.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Repair and restore",
    description:
      "Track repair progress, verify power restoration, and close incidents with appropriate records.",
    icon: Activity,
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative border-b">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--primary)_0%,transparent_48%)] opacity-[0.07]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium">
              <Zap className="size-3.5 text-primary" />
              About the platform
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Bringing power operations into{" "}
              <span className="text-primary">
                one organized system.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              The Load Shedding & Power Outage Management System
              provides a centralized platform for managing electricity
              distribution information, scheduling interruptions,
              coordinating field teams, and tracking restoration.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-6"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Get Started
                <ArrowRight className="size-4" />
              </Button>

              {/* <Button
                size="lg"
                variant="outline"
                className="h-12 px-6"
                nativeButton={false}
                render={<Link href="/#features" />}
              >
                Explore capabilities
              </Button> */}
            </div>
          </div>

          {/* Platform summary */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarClock className="size-5" />
              </div>
              <h2 className="mt-4 font-semibold">
                Structured scheduling
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Organize planned interruptions through defined workflows.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="size-5" />
              </div>
              <h2 className="mt-4 font-semibold">
                Coordinated response
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Connect incident tracking with technician work tasks.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="mt-4 font-semibold">
                Clear accountability
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Track operational progress and verify restoration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-semibold text-primary">
            OUR PURPOSE
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            A clearer way to manage electricity operations
          </h2>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            Electricity distribution involves infrastructure,
            customer reports, planned interruptions, unexpected
            incidents, and field repairs. Managing these activities
            through disconnected processes can make it harder to
            understand progress and coordinate responses.
          </p>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            This platform brings these operational activities
            together, helping authorized users access relevant
            information, follow defined workflows, and track
            incidents through restoration.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 sm:p-7">
          <div className="flex items-center gap-3 border-b pb-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Activity className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold">
                Connected operations
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                From infrastructure to restoration
              </p>
            </div>
          </div>

          <div className="space-y-0 pt-5">
            {[
              {
                title: "Distribution infrastructure",
                description: "Zones, substations, feeders, and areas",
              },
              {
                title: "Scheduling and incidents",
                description: "Planned interruptions and outage reports",
              },
              {
                title: "Field work",
                description: "Task assignment and repair progress",
              },
              {
                title: "Restoration and closure",
                description: "Verification and operational records",
              },
            ].map((item, index, items) => (
              <div key={item.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-semibold text-primary">
                    {index + 1}
                  </div>
                  {index < items.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>

                <div className="pb-6">
                  <h4 className="text-sm font-medium">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <Features />

      {/* Workflow */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One connected operational workflow
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Each stage has a defined purpose, helping teams
            coordinate their work and maintain visibility into
            operational progress.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {workflowSteps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="rounded-xl border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    STEP {step.number}
                  </span>
                  <Icon className="size-5 text-muted-foreground" />
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <CTA />
    </main>
  );
}