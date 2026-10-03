export type WorkTaskStatus =
  | "PENDING"
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"
  | "FAILED";

export interface IWorkTask {
  id: string;
  incidentId: string;
  technicianId: string | null;

  title: string;
  description: string | null;

  status: WorkTaskStatus;

  assignedAt: string | null;
  acceptedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;

  rejectionReason: string | null;
  failureReason: string | null;
  repairNote: string | null;

  createdBy: string;
  createdAt: string;
  updatedAt: string;

  technician: {
    id: string;
    name: string;
    email: string;
    role: "TECHNICIAN";
  } | null;

  creator: {
    id: string;
    name: string;
    email: string;
    role: "POWER_OPERATOR" | "ZONE_MANAGER" | "ADMIN";
  };

  incident: {
    id: string;
    status:
      | "INVESTIGATING"
      | "REPAIRING"
      | "RESTORATION_PENDING"
      | "RESTORED"
      | "CLOSED";

    feeder: {
      id: string;
      name: string;
      code: string;
    };
  };
}