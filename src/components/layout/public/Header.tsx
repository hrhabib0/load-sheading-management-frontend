
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight"
                >
                    PowerGrid
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Home
                    </Link>

                    <Link
                        href="/outages"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Outages
                    </Link>

                    <Link
                        href="/load-shedding"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Load Shedding
                    </Link>

                    <Link
                        href="/about-us"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        About Us
                    </Link>
                </nav>

                {/* Login */}
                <Button>
                    <Link href="/login">
                        Login
                    </Link>
                </Button>
            </div>
        </header>
    );
};

export default Header;
