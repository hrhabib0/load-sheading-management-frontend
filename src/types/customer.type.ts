export interface ICustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customerProfile: {
    id: string;
    area: {
      id: string;
      name: string;
      code: string;
    };
    priority: {
      id: string;
      name: string;
      level: number;
      description: string | null;
    };
  };
}


export type CustomerReportStatus =
    | "PENDING"
    | "LINKED"
    | "CANCELLED";

export interface ICustomerReport {
    id: string;
    customerId: string;
    incidentId: string | null;
    description: string;
    reportedAt: string;
    status: CustomerReportStatus;
    cancelledAt: string | null;
    linkedAt: string | null;
    createdAt: string;
    updatedAt: string;
}