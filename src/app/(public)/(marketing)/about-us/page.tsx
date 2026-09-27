
export default function AboutPage() {
    return (
            <main className="mx-auto max-w-5xl px-4 py-16">
                <section className="max-w-3xl">
                    <p className="mb-3 text-sm font-medium text-primary">
                        About the System
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Smarter Power Management
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        The Load Shedding & Power Outage Management System
                        is designed to help electricity service providers
                        manage power distribution, planned outages,
                        unexpected outages, load-shedding schedules, and
                        field operations from a single platform.
                    </p>
                </section>

                <section className="mt-16 grid gap-8 md:grid-cols-3">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Power Management
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Manage load-shedding schedules, planned outages,
                            and distribution information in an organized way.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Faster Response
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Report unexpected outages and coordinate
                            technicians to investigate and resolve problems.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Better Communication
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Keep customers and operational teams informed
                            about important outages, schedules, and
                            restoration updates.
                        </p>
                    </div>
                </section>
            </main>
    );
}
