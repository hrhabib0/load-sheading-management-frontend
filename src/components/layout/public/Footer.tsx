import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t bg-background">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} PowerGrid. All rights
                    reserved.
                </p>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/about"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        About
                    </Link>

                    <Link
                        href="/privacy"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Privacy
                    </Link>

                    <Link
                        href="/contact"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Contact
                    </Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;