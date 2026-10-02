export type LoadSheddingScheduleStatus =
    | "DRAFT"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export interface ILoadSheddingSchedule {
    id: string;
    title: string;
    description: string | null;
    status: LoadSheddingScheduleStatus;
    createdBy: string;
    approvedBy: string | null;
    approvedAt: string | null;
    publishedAt: string | null;
    scheduledStartAt: string;
    scheduledEndAt: string;
    actualStartAt: string | null;
    actualEndAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
}