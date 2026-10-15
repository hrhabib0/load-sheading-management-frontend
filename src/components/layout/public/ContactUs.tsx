
import Link from "next/link";
import { ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section className="border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-7 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-primary">
                <MessageSquare size={15} />
                We're here to help
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Have a question about PowerGrid?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                Find answers about our platform, electricity schedules, and
                outage management. Visit our contact page to learn more.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck size={17} className="text-primary" />
                A clearer way to manage electricity information
              </div>
            </div>

            <div className="relative flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
              <Button
                size="lg"
                render={<Link href="/contact-us" />}
                nativeButton={false}
                className="gap-2"
              >
                Contact us
                <ArrowRight size={16} />
              </Button>

              <Button
                size="lg"
                variant="outline"
                render={<Link href="/about-us" />}
                nativeButton={false}
              >
                About PowerGrid
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
