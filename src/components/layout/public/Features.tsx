import { Activity, CalendarClock, MapPinned, ShieldCheck, Wrench, Zap } from "lucide-react";


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

export const Features = () => {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">
            PLATFORM CAPABILITIES
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything operations teams need
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Bring distribution infrastructure, outage response,
            scheduling, and field operations into one organized system.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group relative rounded-2xl border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>

                  <span className="text-xs font-medium tabular-nums text-muted-foreground/60">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-semibold tracking-tight">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    )
}