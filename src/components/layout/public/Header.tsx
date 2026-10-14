
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useGetMe, useLogout } from "@/hooks";
import { toast } from "@/components/ui/toast";

const navigation = [
  { label: "Home", href: "/", icon: Zap },
  { label: "Blogs", href: "/blogs", icon: BookOpen },
  { label: "About Us", href: "/about-us", icon: ShieldCheck },
];

const Header = () => {
  const { data, isLoading } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !isLoading && Boolean(data);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: async () => {
        await queryClient.cancelQueries();
        queryClient.clear();

        setMobileMenuOpen(false);

        toast.add({
          title: "Goodbye!",
          description: "Logged out successfully",
          type: "success",
        });

        router.replace("/login");
        router.refresh();
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-19 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="PowerGrid home"
          onClick={closeMobileMenu}
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Zap size={23} fill="currentColor" strokeWidth={2} />
          </span>

          <span className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight">
              PowerGrid
            </span>
            <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:block">
              Power management
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border bg-muted/40 p-1 md:flex"
        >
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : isAuthenticated ? (
            <>
              <Button
                variant={isActive("/dashboard") ? "secondary" : "ghost"}
                render={<Link href="/dashboard" />}
                nativeButton={false}
                className="gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="gap-2"
              >
                <LogOut size={16} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                render={<Link href="/login" />}
                nativeButton={false}
                className="gap-2"
              >
                Login
              </Button>

              <Button
                render={<Link href="/register" />}
                nativeButton={false}
                className="gap-2"
              >
                Get started
                <ArrowRight size={16} />
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
            <nav aria-label="Mobile navigation" className="grid gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t pt-4">
              {isLoading ? (
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              ) : isAuthenticated ? (
                <div className="grid gap-2">
                  <Button
                    render={<Link href="/dashboard" />}
                    nativeButton={false}
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={closeMobileMenu}
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full justify-start gap-2"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut size={17} />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    render={<Link href="/login" />}
                    nativeButton={false}
                    className="gap-2"
                    onClick={closeMobileMenu}
                  >
                    <LogIn size={16} />
                    Login
                  </Button>

                  <Button
                    render={<Link href="/register" />}
                    nativeButton={false}
                    className="gap-2"
                    onClick={closeMobileMenu}
                  >
                    Get started
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </div>

            <p className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
              <ShieldCheck size={14} />
              Smarter electricity management
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
