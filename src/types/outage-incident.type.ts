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