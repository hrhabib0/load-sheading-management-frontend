"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
} from "lucide-react";

import { useGetMyNotifications } from "@/hooks";
import { NotificationCard } from "@/components/dashboard/Customer Dashboard/notifications/notification-card";

type NotificationFilter = "ALL" | "UNREAD";


export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationFilter>("ALL");

  const {
    data,
    isLoading,
    isError,
  } = useGetMyNotifications();

  const notifications = data?.data ?? [];

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "UNREAD") {
      return notifications.filter((notification) => !notification.isRead);
    }

    return notifications;
  }, [filter, notifications]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with important electricity service information.
          </p>
        </div>

        <div className="flex min-h-60 items-center justify-center rounded-xl border">
          <div className="flex flex-col items-center gap-3">
            <div className="size-7 animate-spin rounded-full border-2 border-muted border-t-primary" />
            <p className="text-sm text-muted-foreground">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with important electricity service information.
          </p>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertTriangle className="mx-auto size-8 text-destructive" />

          <h2 className="mt-3 font-semibold">
            Unable to load notifications
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Bell className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Stay updated with important electricity service information.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Total Notifications
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Unread
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight">
            {unreadCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === "ALL"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setFilter("UNREAD")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === "UNREAD"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-2">
              ({unreadCount})
            </span>
          )}
        </button>
      </div>

      {/* Notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="rounded-xl border bg-background p-10 text-center">
          <Bell className="mx-auto size-9 text-muted-foreground" />

          <h2 className="mt-4 font-semibold">
            {filter === "UNREAD"
              ? "No unread notifications"
              : "No notifications yet"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {filter === "UNREAD"
              ? "You're all caught up."
              : "Important service updates will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
}