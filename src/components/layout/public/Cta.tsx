import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

const CTA = () => {
    return (
        <section className="border-y bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
                <div className="relative overflow-hidden rounded-2xl border bg-card px-6 py-12 text-center sm:px-12 sm:py-16">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_65%)] opacity-[0.08]" />

                <div className="relative mx-auto max-w-2xl">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Zap className="size-6" />
                    </div>

                    <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                    Bring your power operations together
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    Access a centralized workspace for distribution
                    management, outage coordination, and operational visibility.
                    </p>

                    <Button
                    size="lg"
                    className="mt-7 h-12 px-6"
                    nativeButton={false}
                    render={<Link href="/login" />}
                    >
                    Get Started
                    <ArrowRight className="size-4" />
                    </Button>
                </div>
                </div>
            </div>
        </section>
    )
}

export default CTA;