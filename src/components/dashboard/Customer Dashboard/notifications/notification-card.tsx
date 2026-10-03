import { INotification, NotificationType } from "@/types/notification.type";
import { AlertTriangle, Bell, CalendarClock, CheckCircle2, Wrench } from "lucide-react";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "LOAD_SHEDDING_PUBLISHED":
      return CalendarClock;

    case "PLANNED_OUTAGE_PUBLISHED":
      return CalendarClock;

    case "UNEXPECTED_OUTAGE":
      return AlertTriangle;

    case "OUTAGE_RESTORED":
      return CheckCircle2;

    case "WORK_TASK_ASSIGNED":
      return Wrench;

    default:
      return Bell;
  }
};

const formatNotificationTime = (date: string) => {
  const notificationDate = new Date(date);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - notificationDate.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return notificationDate.toLocaleDateString();
};

export function NotificationCard({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: {
  notification: INotification;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead: boolean;
}) {
  const Icon = getNotificationIcon(notification.type);

  return (
    <div
      className={`rounded-xl border bg-background p-4 transition-colors sm:p-5 ${
        !notification.isRead ? "border-primary/30 bg-primary/[0.03]" : ""
      }`}
    >
      <div className="flex gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{notification.title}</h3>

              {!notification.isRead && (
                <span className="size-2 shrink-0 rounded-full bg-primary" />
              )}
            </div>

            <span className="shrink-0 text-xs text-muted-foreground">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {notification.message}
          </p>
          {!notification.isRead && (
            <button
              type="button"
              onClick={() => onMarkAsRead(notification.id)}
              disabled={isMarkingAsRead}
              className="mt-3 text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMarkingAsRead ? "Marking..." : "Mark as read"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}