export type CustomerReportStatus = "PENDING" | "LINKED" | "CANCELLED";

export interface IReport {
  id: string;
  description: string;
  reportedAt: string;
  status: CustomerReportStatus;
  cancelledAt: string | null;
  linkedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  incidentId: string | null;

  customer: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
    area: {
      id: string;
      name: string;
      code: string;
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
    };
  };

  incident: {
    id: string;
    status: string;
  } | null;
}