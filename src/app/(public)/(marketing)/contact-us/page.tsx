
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const supportTopics = [
  "General inquiry",
  "Load-shedding schedule",
  "Power outage report",
  "Technical support",
  "Account assistance",
  "Other",
];

const faqs = [
  {
    question: "Where can I check load-shedding schedules?",
    answer:
      "Visit the dashboard to access the schedule features available to your account.",
  },
  {
    question: "How should I report an unexpected outage?",
    answer:
      "Sign in to your account and use the available customer reporting features. For immediate electrical hazards, contact the relevant electricity provider or emergency service.",
  },
  {
    question: "Can I use this form to report an emergency?",
    answer:
      "No. This contact form is for general inquiries. It is not monitored as an emergency channel, and the demo form is not connected to a support system.",
  },
];

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/[0.07] to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-sm font-medium text-primary">
              <MessageSquare size={15} />
              Contact PowerGrid
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              How can we
              <span className="block text-primary">help you today?</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Have a question about electricity schedules, outage management,
              or the PowerGrid platform? Send us a message and find the right
              place to get help.
            </p>
          </div>
        </div>
      </section>

      {/* Main contact content */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 lg:py-16">
        {/* Contact information */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Let's get in touch
          </h2>

          <p className="mt-3 leading-7 text-muted-foreground">
            Choose the appropriate support channel for your question. For
            urgent electrical hazards, contact your local electricity provider
            or emergency service directly.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4 rounded-2xl border bg-card p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail size={21} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold">Email support</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  For general questions and platform assistance.
                </p>
                <p className="mt-2 text-sm font-medium text-primary">
                  Contact email coming soon
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border bg-card p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Headphones size={21} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold">Customer assistance</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Get guidance on using schedules, outage reports, and account
                  features.
                </p>
                <p className="mt-2 text-sm font-medium text-primary">
                  Support channel coming soon
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border bg-card p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock3 size={21} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold">Response expectations</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Our contact workflow is being prepared. Response times will
                  be published once support operations are established.
                </p>
              </div>
            </div>
          </div>

          {/* Safety notice */}
          <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              <div>
                <h3 className="font-semibold">Electrical safety first</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Never use this form to report an immediate danger, fallen
                  power line, or electrical fire. Contact the appropriate
                  emergency service or electricity provider.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold tracking-tight">
              Send us a message
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Complete the form below with details about your inquiry.
            </p>
          </div>

          {submitted ? (
            <div
              className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                <CheckCircle2 size={25} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Demo form completed
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This form is not connected to a backend yet. Your message has
                not been sent or stored.
              </p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => setSubmitted(false)}
              >
                Back to the form
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium"
                  >
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                    maxLength={100}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium"
                  >
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    maxLength={254}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-topic"
                  className="text-sm font-medium"
                >
                  What can we help you with?
                </label>
                <select
                  id="contact-topic"
                  name="topic"
                  required
                  defaultValue=""
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {supportTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-subject"
                  className="text-sm font-medium"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  placeholder="Briefly describe your inquiry"
                  required
                  maxLength={150}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell us how we can help..."
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={6}
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
                <p className="text-xs text-muted-foreground">
                  Please don't include passwords or sensitive account
                  information.
                </p>
              </div>

              <Button type="submit" className="h-11 w-full gap-2">
                Submit demo form
                <Send size={16} />
              </Button>

              <p className="text-center text-xs leading-5 text-muted-foreground">
                Demo only. Submitting this form will not send your message to
                a support team.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary">
              QUICK ANSWERS
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              A few useful answers before you get in touch.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border bg-card p-5"
              >
                <summary className="cursor-pointer list-none font-medium marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-xl text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 pr-6 text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              variant="outline"
              render={<Link href="/about-us" />}
              nativeButton={false}
              className="gap-2"
            >
              Learn more about PowerGrid
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
