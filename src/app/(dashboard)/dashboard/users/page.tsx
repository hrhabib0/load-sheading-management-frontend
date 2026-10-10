
"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  X,
} from "lucide-react";

import { useGetAllUsers } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/shared/page-loader";
import { UserRole } from "@/types/auth.type";


const PAGE_SIZE = 10;

const roles: { label: string; value: UserRole | "ALL" }[] = [
  { label: "All roles", value: "ALL" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Technician", value: "TECHNICIAN" },
  { label: "Power Operator", value: "POWER_OPERATOR" },
  { label: "Zone Manager", value: "ZONE_MANAGER" },
  { label: "Admin", value: "ADMIN" },
];

function formatRole(role: UserRole) {
  return role
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export default function AdminUsersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">(
    "ALL",
  );
  const [page, setPage] = useState(1);

  // Debounce search so we don't request the API for every keystroke.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const params = {
    page,
    limit: PAGE_SIZE,
    ...(search ? { search } : {}),
    ...(role !== "ALL" ? { role } : {}),
    ...(status !== "ALL"
      ? { isActive: status === "ACTIVE" }
      : {}),
  };

  const {
    data: response,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useGetAllUsers(params);

  const users = response?.data.users ?? [];
  const meta = response?.data.meta;

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setRole("ALL");
    setStatus("ALL");
    setPage(1);
  };

  const hasFilters =
    searchInput.length > 0 || role !== "ALL" || status !== "ALL";

  if (isPending && !response) {
    return <PageLoader />;
  }

  if (isError && !response) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage system accounts and their roles.
          </p>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load users
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage registered accounts across the system.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <Users className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {meta?.total ?? 0} users
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_200px_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search name or email..."
              aria-label="Search users by name or email"
              className="pl-9"
            />
          </div>

          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value as UserRole | "ALL");
              setPage(1);
            }}
            aria-label="Filter by role"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {roles.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value as "ALL" | "ACTIVE" | "INACTIVE",
              );
              setPage(1);
            }}
            aria-label="Filter by account status"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={!hasFilters}
          >
            <X />
            Reset
          </Button>
        </div>

        {isFetching && (
          <p className="mt-3 text-xs text-muted-foreground">
            Updating results...
          </p>
        )}
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">Registered Users</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, and review account information.
          </p>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Users className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-3 font-semibold">No users found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    User
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    Phone
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    Role
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap font-medium">
                        {user.name}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {user.email}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {user.phone || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {formatRole(user.role)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={
                          user.isActive
                            ? "rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600"
                            : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {meta && meta.total > 0
              ? `Showing ${(meta.page - 1) * meta.limit + 1}–${Math.min(
                  meta.page * meta.limit,
                  meta.total,
                )} of ${meta.total} users`
              : "No results"}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta || page <= 1 || isFetching}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft />
              Previous
            </Button>

            <span className="min-w-20 text-center text-sm text-muted-foreground">
              Page {meta?.page ?? 1} of {meta?.totalPages ?? 0}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={
                !meta ||
                page >= meta.totalPages ||
                isFetching
              }
              onClick={() => setPage((current) => current + 1)}
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}