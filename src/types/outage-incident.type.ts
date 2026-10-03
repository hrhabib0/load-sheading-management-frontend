export type CustomerPowerStatus =
  | "NORMAL"
  | "INVESTIGATING"
  | "REPAIRING"
  | "RESTORATION_PENDING";

export interface IMyAreaOutageStatus {
  isPowerAvailable: boolean;
  status: CustomerPowerStatus;
  incident: {
    id: string;
    status: Exclude<CustomerPowerStatus, "NORMAL">;
    description: string | null;
    startedAt: string | null;
    feeder: {
      id: string;
      name: string;
      code: string;
    };
  } | null;
}

export type OutageIncidentStatus =
  | "INVESTIGATING"
  | "REPAIRING"
  | "RESTORATION_PENDING"
  | "RESTORED"
  | "CLOSED";

export interface IOutageIncident {
  id: string;
  status: OutageIncidentStatus;
  description: string | null;
  startedAt: string | null;
  restoredAt: string | null;
  closedAt: string | null;
  verifiedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
  feederId: string;
  createdBy: string;
  verifiedBy: string | null;

  feeder: {
    id: string;
    name: string;
    code: string;
    substation: {
      id: string;
      name: string;
      zone: {
        id: string;
        name: string;
        code: string;
      };
    };
  };

  creator: {
    id: string;
    name: string;
    email: string;
    role:
      | "CUSTOMER"
      | "TECHNICIAN"
      | "POWER_OPERATOR"
      | "ZONE_MANAGER"
      | "ADMIN";
  };
}

export type PlannedOutageStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface IPlannedOutage {
  id: string;
  title: string;
  description: string | null;
  status: PlannedOutageStatus;
  createdBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  scheduledStartAt: string;
  scheduledEndAt: string;
  actualStartAt: string | null;
  actualEndAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;

  creator: {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "TECHNICIAN" | "POWER_OPERATOR" | "ZONE_MANAGER" | "ADMIN";
  };

  approver: {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "TECHNICIAN" | "POWER_OPERATOR" | "ZONE_MANAGER" | "ADMIN";
  } | null;

  feeders: {
    id: string;
    plannedOutageId: string;
    feederId: string;
    createdAt: string;
    feeder: {
      id: string;
      name: string;
      code: string;
      substation: {
        id: string;
        name: string;
        zoneId: string;
        zone: {
          id: string;
          name: string;
          code: string;
        };
      };
    };
  }[];
}