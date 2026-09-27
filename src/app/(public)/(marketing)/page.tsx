import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">

            <main className="flex-1">
                <section className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
                    <p className="mb-4 text-sm font-medium text-primary">
                        Power Management System
                    </p>

                    <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Smarter Management of Power and Outages
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                        Manage load shedding, planned outages, unexpected
                        power problems, and field operations from one
                        centralized platform.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button size="lg">
                            <Link href="/login">
                                Get Started
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                        >
                            <Link href="/about">
                                Learn More
                            </Link>
                        </Button>
                    </div>
                </section>

                <section className="border-t bg-muted/30">
                    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 md:grid-cols-3">
                        <div>
                            <h2 className="font-semibold">
                                Load Shedding
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Plan and manage load-shedding schedules
                                based on service priorities.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Outage Management
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Track unexpected outages from initial
                                reports through restoration.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Field Operations
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Assign work tasks and coordinate
                                technicians to resolve power problems.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}

