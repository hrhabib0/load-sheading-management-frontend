import Link from "next/link";
import {
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Activity,
  Mail,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="PowerGrid home"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Zap size={22} fill="currentColor" />
              </span>

              <span className="text-xl font-bold tracking-tight">
                PowerGrid
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Smarter power outage management. Stay informed about
              planned maintenance, load shedding, and service
              restoration.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <ShieldCheck size={14} className="text-primary" />
              Built for reliable operations
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">
              Platform
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About PowerGrid
                </Link>
              </li>

              <li>
                <Link
                  href="/blogs"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blogs & Updates
                </Link>
              </li>

              <li>
                <Link
                  href="/contact-us"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">
              Resources
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Create an account
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>

              <li>
                <Link
                  href="/contact-us"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform overview */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">
              Stay informed
            </h3>

            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              Access outage information and stay updated on power
              service activities in your area.
            </p>

            <Link
              href="/contact-us"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <Mail size={16} />
              Get in touch
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <div className="mt-5 flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <Activity size={17} className="shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground">
                One place for outage information and operational
                updates.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} PowerGrid. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>

            <span className="hidden h-3 w-px bg-border sm:block" />

            <Link
              href="/contact-us"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>

            <span className="hidden h-3 w-px bg-border sm:block" />

            <Link
              href="/"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to home ↑
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;