"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMe, useLogout } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
    const {data, isLoading} = useGetMe();
    const {mutate:logout} = useLogout();
    const queryClient = useQueryClient();
    
    const handleLogout = () =>{
        logout(undefined, {
            onSuccess: () => {
                toast.add({
                    title: "Good Bye!",
                    description: "Logged out successfully",
                    type: "success",
                });
                queryClient.removeQueries({queryKey:["user"]});
            },
            onError: () => {
                toast.add({
                    title: "Logout failed",
                    description: "Something Went Wrong",
                    type: "error",
                });
            },
        })
    }
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
                <div>
                    {!isLoading && !data && (
                    <Button
                        variant="outline"
                        render={<Link href="/login">Login</Link>}
                        nativeButton={false}
                    >
                        Login
                    </Button>
                    )}
                    {!isLoading && data && (
                    <Button onClick={handleLogout} variant="destructive">
                        Logout
                    </Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
