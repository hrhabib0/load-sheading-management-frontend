import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";

const lastUpdated = "October 15, 2026";

const sections = [
  {
    id: "information-we-collect",
    number: "01",
    title: "Information We Collect",
    icon: Database,
    content: [
      {
        heading: "Account information",
        text: "When you register, PowerGrid may collect information such as your name, email address, phone number, account credentials, and assigned service area, depending on the fields required by the application.",
      },
      {
        heading: "Service and operational information",
        text: "We may process information related to customer reports, power outages, load-shedding schedules, planned maintenance, work tasks, and service restoration.",
      },
      {
        heading: "Technical information",
        text: "When you use the platform, technical information may be processed to support application functionality, security, troubleshooting, and service reliability, depending on the infrastructure and logging configuration.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    number: "02",
    title: "How We Use Information",
    icon: Zap,
    content: [
      {
        heading: "Provide platform services",
        text: "We use relevant information to manage accounts, display service information, process customer reports, coordinate operational tasks, and support outage management workflows.",
      },
      {
        heading: "Communicate important updates",
        text: "Contact information may be used to communicate relevant service updates, including planned interruptions, reported outages, task assignments, and restoration notices where applicable.",
      },
      {
        heading: "Maintain and improve the platform",
        text: "Operational information may be used to troubleshoot problems, maintain system integrity, understand service activity, and improve application functionality.",
      },
    ],
  },
  {
    id: "sharing-and-access",
    number: "03",
    title: "Information Sharing and Access",
    icon: UserRound,
    content: [
      {
        heading: "Role-based access",
        text: "PowerGrid is designed around user roles and operational responsibilities. Customers, technicians, power operators, zone managers, and administrators may have different levels of access to information.",
      },
      {
        heading: "Service providers",
        text: "Information may be processed by infrastructure or service providers that support hosting, databases, email delivery, or other platform functions, where those services are configured.",
      },
      {
        heading: "Legal and security requirements",
        text: "Information may be disclosed when required by applicable law or when reasonably necessary to protect the platform, its users, or its operational integrity.",
      },
    ],
  },
  {
    id: "data-security",
    number: "04",
    title: "Data Security",
    icon: LockKeyhole,
    content: [
      {
        heading: "Protecting your information",
        text: "We aim to protect information through appropriate access controls, authentication mechanisms, and responsible system administration. The specific safeguards depend on the implemented application and infrastructure.",
      },
      {
        heading: "Your responsibility",
        text: "Keep your login credentials confidential and notify the platform administrator if you suspect unauthorized access to your account.",
      },
      {
        heading: "Security limitations",
        text: "No internet-connected system can be guaranteed to be completely secure. Access to the platform should be limited to authorized users and used responsibly.",
      },
    ],
  },
  {
    id: "retention",
    number: "05",
    title: "Data Retention",
    icon: FileText,
    content: [
      {
        heading: "How long information is kept",
        text: "Information may be retained for as long as needed to provide platform services, maintain account records, preserve outage and maintenance history, support operational accountability, or meet applicable legal requirements.",
      },
      {
        heading: "Account and operational records",
        text: "Closing or deactivating an account does not necessarily mean that related operational records are immediately removed. Retention and deletion depend on the platform's implemented policies and applicable requirements.",
      },
    ],
  },
  {
    id: "notifications",
    number: "06",
    title: "Notifications and Communications",
    icon: Bell,
    content: [
      {
        heading: "Service notifications",
        text: "Depending on the available features, PowerGrid may provide notifications about planned outages, unexpected outages, assigned work tasks, and restoration updates.",
      },
      {
        heading: "Delivery methods",
        text: "The channels used for notifications depend on the services enabled by the platform. We do not promise delivery through email, SMS, or push notifications unless that functionality is available and configured.",
      },
    ],
  },
  {
    id: "your-rights",
    number: "07",
    title: "Your Choices and Rights",
    icon: ShieldCheck,
    content: [
      {
        heading: "Review your information",
        text: "Where supported, you may review or update your account information through the platform. You may also contact the responsible administrator to ask about your information.",
      },
      {
        heading: "Request assistance",
        text: "You may request clarification about the information associated with your account or ask how to correct inaccurate information. Requests will be handled according to applicable law and the platform's actual capabilities.",
      },
    ],
  },
  {
    id: "policy-changes",
    number: "08",
    title: "Changes to This Policy",
    icon: FileText,
    content: [
      {
        heading: "Updates",
        text: "This Privacy Policy may be revised as PowerGrid's features, infrastructure, or data practices change. The date at the top of this page indicates when this version was last updated.",
      },
      {
        heading: "Reviewing changes",
        text: "Please review this page periodically to understand how information is handled. Where required, significant changes should be communicated through an appropriate channel.",
      },
    ],
  },
];

const PrivacyPage = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/10,transparent_55%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-primary shadow-sm">
              <ShieldCheck size={15} />
              Privacy & data protection
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your information.
              <span className="block text-primary">
                Our responsibility.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              This policy explains how PowerGrid may collect, use,
              protect, and retain information when you use our
              electricity outage and load-shedding management
              platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-lg border bg-background px-3 py-2">
                Last updated: {lastUpdated}
              </span>
              <span className="rounded-lg border bg-background px-3 py-2">
                Estimated reading time: 5–7 minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Policy content */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8 lg:py-16">
        {/* Table of contents */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="text-sm font-semibold">
              On this page
            </h2>

            <nav aria-label="Privacy policy sections" className="mt-4">
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-start gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <span className="pt-0.5 text-xs tabular-nums text-primary">
                        {section.number}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 border-t pt-5">
              <div className="flex items-start gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div>
                  <p className="text-sm font-medium">
                    Questions about privacy?
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Contact the team through our contact page.
                  </p>
                  <Link
                    href="/contact-us"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Contact us <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main policy */}
        <div className="min-w-0">
          <div className="mb-8 rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-primary"
              />
              <div>
                <h2 className="font-semibold">
                  Privacy at a glance
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  PowerGrid handles account and operational
                  information to support outage management. Access
                  depends on user roles and system permissions.
                  The details below describe the intended approach
                  and should be aligned with the platform&apos;s
                  actual implementation before public release.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border bg-card p-5 sm:p-7"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold tabular-nums text-primary">
                          {section.number}
                        </span>
                        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                          {section.title}
                        </h2>
                      </div>

                      <div className="mt-5 space-y-5">
                        {section.content.map((item) => (
                          <div key={item.heading}>
                            <h3 className="text-sm font-semibold">
                              {item.heading}
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-muted-foreground">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* Closing note */}
          <div className="mt-8 rounded-2xl border bg-muted/30 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={22}
                className="mt-0.5 shrink-0 text-primary"
              />
              <div>
                <h2 className="text-base font-semibold">
                  Questions or concerns?
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  If you have questions about this policy or how
                  your information is handled, please reach out
                  through our contact page.
                </p>

                <Link
                  href="/contact-us"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Contact PowerGrid
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* <p className="mt-6 text-xs leading-5 text-muted-foreground">
            This page is a general privacy-policy template, not
            legal advice. Before publishing it as your official
            policy, verify that it accurately reflects your data
            collection, hosting, retention, security, and
            notification practices and complies with applicable
            privacy laws.
          </p> */}
        </div>
      </section>
    </main>
  );
};

export default PrivacyPage;