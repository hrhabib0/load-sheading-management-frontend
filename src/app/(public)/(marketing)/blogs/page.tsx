
"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "All",
  "Load Shedding",
  "Power Outages",
  "Energy Tips",
  "Technology",
  "Safety",
] as const;

type Category = (typeof categories)[number];

type Blog = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<Category, "All">;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
  theme: string;
  icon: typeof Zap;
  content: string[];
};

const blogs: Blog[] = [
  {
    id: 1,
    slug: "understanding-load-shedding",
    title: "Understanding Load Shedding: Why It Happens and How It Works",
    excerpt:
      "Learn why electricity providers sometimes interrupt power supply, how schedules are planned, and what customers can do to prepare.",
    category: "Load Shedding",
    date: "October 8, 2026",
    readTime: "6 min read",
    author: "Editorial Team",
    featured: true,
    theme: "from-blue-700 via-blue-600 to-cyan-500",
    icon: Zap,
    content: [
      "Load shedding is a planned and temporary interruption of electricity supply. It may be necessary when electricity demand exceeds the power that can safely be supplied.",
      "Distribution operators can use schedules to organize interruptions across different areas. A well-planned schedule considers available capacity, service priorities, previous interruptions, and operational constraints.",
      "Customers can prepare by charging essential devices, keeping emergency lighting available, and checking official announcements for updates. Critical facilities may require separate arrangements based on applicable policies.",
      "A load-shedding schedule is a plan, not a guarantee that every interruption will happen exactly as expected. Actual power conditions can change, so customers should follow official updates.",
    ],
  },
  {
    id: 2,
    slug: "planned-vs-unexpected-outages",
    title: "Planned vs. Unexpected Outages: What's the Difference?",
    excerpt:
      "Not every power interruption has the same cause. Discover how maintenance outages differ from unexpected faults.",
    category: "Power Outages",
    date: "October 5, 2026",
    readTime: "5 min read",
    author: "Operations Team",
    theme: "from-violet-700 to-indigo-500",
    icon: ShieldCheck,
    content: [
      "A planned outage is scheduled in advance, often to support maintenance, equipment replacement, or infrastructure improvements. Customers can usually be informed before the interruption begins.",
      "An unexpected outage occurs when a fault or other unplanned event interrupts electricity supply. Operators investigate the incident, identify the affected infrastructure, and coordinate repair work.",
      "Both types of outages benefit from accurate records, clear status updates, and reliable communication. Keeping planned work separate from incident response helps teams manage each situation appropriately.",
      "Restoration should be confirmed by authorized operational staff rather than assumed simply because a scheduled end time has passed or a repair task has been marked complete.",
    ],
  },
  {
    id: 3,
    slug: "prepare-for-a-power-outage",
    title: "How to Prepare Your Home for a Power Outage",
    excerpt:
      "A practical checklist for keeping essential devices charged, protecting electronics, and staying prepared during interruptions.",
    category: "Energy Tips",
    date: "September 29, 2026",
    readTime: "4 min read",
    author: "Customer Care Team",
    theme: "from-emerald-700 to-teal-500",
    icon: ShieldCheck,
    content: [
      "A little preparation can make a power interruption easier to manage. Keep flashlights, spare batteries, and essential phone chargers in an accessible place.",
      "Charge important devices ahead of a known interruption. If you use backup power equipment, follow its manufacturer's instructions and make sure it is appropriate for the devices you need to support.",
      "Unplug sensitive electronics when appropriate and use properly rated surge protection. Never connect a generator indoors or operate one near doors, windows, or ventilation openings.",
      "If someone in your household relies on electrically powered medical equipment, prepare a backup plan with the relevant healthcare provider and electricity supplier.",
    ],
  },
  {
    id: 4,
    slug: "smart-technology-in-electricity-distribution",
    title: "How Smart Technology Can Improve Electricity Distribution",
    excerpt:
      "Explore how digital monitoring, operational data, and automated recommendations can support better outage management.",
    category: "Technology",
    date: "September 22, 2026",
    readTime: "7 min read",
    author: "Technology Team",
    theme: "from-sky-700 to-blue-500",
    icon: Zap,
    content: [
      "Digital systems can help distribution teams organize infrastructure information, monitor reported incidents, and coordinate work across operational areas.",
      "When outage reports are linked to the relevant distribution feeder, operators can identify related reports and build a clearer picture of the affected areas.",
      "Historical records can also support planning. For example, a scheduling system can consider previous interruption durations and configured service priorities when generating recommendations.",
      "Automation should support informed decisions rather than replace operational accountability. Recommended schedules and restoration actions should follow the appropriate review and approval process.",
    ],
  },
  {
    id: 5,
    slug: "electrical-safety-during-outages",
    title: "Essential Electrical Safety Tips During a Power Outage",
    excerpt:
      "Simple precautions to help households avoid electrical hazards before, during, and after power restoration.",
    category: "Safety",
    date: "September 16, 2026",
    readTime: "5 min read",
    author: "Safety Team",
    theme: "from-amber-600 to-orange-500",
    icon: ShieldCheck,
    content: [
      "Treat fallen power lines as energized. Stay far away and report them to the appropriate electricity provider or emergency service.",
      "Keep generators outdoors in a well-ventilated location, away from windows and doors. Never power a home's wiring through an improvised connection.",
      "Avoid touching wet electrical equipment or attempting repairs to distribution infrastructure. These tasks should be handled by qualified personnel.",
      "When electricity returns, reconnect equipment carefully and seek professional help if you notice burning smells, sparks, damaged wiring, or other signs of an electrical fault.",
    ],
  },
  {
    id: 6,
    slug: "why-outage-communication-matters",
    title: "Why Clear Outage Updates Matter for Every Customer",
    excerpt:
      "Timely and understandable communication helps customers plan ahead and reduces uncertainty during service interruptions.",
    category: "Power Outages",
    date: "September 10, 2026",
    readTime: "4 min read",
    author: "Customer Care Team",
    theme: "from-rose-700 to-pink-500",
    icon: BookOpen,
    content: [
      "During an outage, customers often need three things: confirmation that the problem is known, an understandable status update, and information about the next steps.",
      "A useful outage update explains which area is affected, whether investigation or repair is underway, and when another update may be available. Estimated restoration times should be communicated carefully and revised when necessary.",
      "Digital notifications can help deliver updates quickly, but the information must remain accurate and relevant to the recipient's area.",
      "Good communication is part of outage management, not an afterthought. It helps customers make decisions while operational teams focus on safe and effective restoration.",
    ],
  },
];

function BlogArtwork({
  blog,
  featured = false,
}: {
  blog: Blog;
  featured?: boolean;
}) {
  const Icon = blog.icon;

  return (
    <div
      className={`relative flex h-full min-h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${blog.theme} ${
        featured ? "min-h-72 md:min-h-full" : ""
      }`}
    >
      <div className="absolute -right-12 -top-12 size-48 rounded-full border border-white/20" />
      <div className="absolute -bottom-16 -left-10 size-52 rounded-full border border-white/20" />
      <div className="absolute right-10 top-10 size-24 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex size-24 items-center justify-center rounded-3xl border border-white/25 bg-white/15 text-white shadow-xl backdrop-blur-sm">
        <Icon size={featured ? 46 : 40} strokeWidth={1.5} />
      </div>

      <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {blog.category}
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const featuredBlog = blogs.find((blog) => blog.featured) ?? blogs[0];

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesCategory =
        activeCategory === "All" || blog.category === activeCategory;

      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query);

      return (
        matchesCategory &&
        matchesSearch &&
        blog.id !== featuredBlog.id
      );
    });
  }, [activeCategory, search, featuredBlog.id]);

  if (selectedBlog) {
    const Icon = selectedBlog.icon;

    return (
      <main className="min-h-screen bg-background">
        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedBlog(null)}
            className="mb-8 gap-2"
          >
            <ArrowLeft size={16} />
            Back to all articles
          </Button>

          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
              {selectedBlog.category}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} />
              {selectedBlog.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 size={15} />
              {selectedBlog.readTime}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {selectedBlog.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {selectedBlog.excerpt}
          </p>

          <div className="mt-8 flex items-center gap-3 border-y py-5">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold">{selectedBlog.author}</p>
              <p className="text-xs text-muted-foreground">
                Load Shedding & Power Outage Management
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl">
            <BlogArtwork blog={selectedBlog} featured />
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-6">
            {selectedBlog.content.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-8 text-foreground/85 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border bg-muted/30 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Stay informed. Stay prepared.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Explore more articles about electricity distribution, outage
              management, and customer preparedness.
            </p>
            <Button
              className="mt-5 gap-2"
              onClick={() => {
                setSelectedBlog(null);
                setActiveCategory("All");
                setSearch("");
              }}
            >
              Explore more articles
              <ArrowRight size={16} />
            </Button>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/[0.07] to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-sm font-medium text-primary">
              <BookOpen size={15} />
              Knowledge & Insights
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Insights for a more
              <span className="block text-primary">
                reliable power future.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Practical guides, electricity safety tips, and insights into
              load shedding and outage management—all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setSelectedBlog(featuredBlog)}
              >
                Read featured article
                <ArrowRight size={17} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("all-articles")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse articles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured article */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          <h2 className="text-lg font-semibold">Featured article</h2>
        </div>

        <div className="grid overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md md:grid-cols-2">
          <div className="min-h-64">
            <BlogArtwork blog={featuredBlog} featured />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                {featuredBlog.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock3 size={14} />
                {featuredBlog.readTime}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {featuredBlog.title}
            </h3>

            <p className="mt-4 leading-7 text-muted-foreground">
              {featuredBlog.excerpt}
            </p>

            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                {featuredBlog.date}
              </span>
              <Button
                variant="outline"
                className="shrink-0 gap-2"
                onClick={() => setSelectedBlog(featuredBlog)}
              >
                Read article
                <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* All articles */}
      <section
        id="all-articles"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Explore our articles
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Helpful information for customers and electricity operations
              teams.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles..."
              aria-label="Search articles"
              className="pl-9"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "article" : "articles"}
            {search.trim() ? " found" : ""}
          </p>
          {(search || activeCategory !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {filteredBlogs.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <BlogArtwork blog={blog} />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-primary">
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={13} />
                      {blog.readTime}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">
                    {blog.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {blog.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4 mt-5">
                    <span className="text-xs text-muted-foreground">
                      {blog.date}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 px-2 text-primary"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      Read more
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed px-6 py-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <Search size={22} className="text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              No articles found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another search term or choose a different category.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </section>

      {/* Closing CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Stay informed about your electricity service.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Explore the platform for outage information and load-shedding
              schedules.
            </p>
          </div>
          <Button
            className="shrink-0 gap-2"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Explore the platform
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </main>
  );
}
