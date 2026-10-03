export type NotificationType =
  | "LOAD_SHEDDING_PUBLISHED"
  | "PLANNED_OUTAGE_PUBLISHED"
  | "UNEXPECTED_OUTAGE"
  | "OUTAGE_RESTORED"
  | "WORK_TASK_ASSIGNED"
  | "GENERAL";

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}