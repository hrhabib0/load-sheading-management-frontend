import { UserRole } from "./auth.type";

export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface IUsersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetAllUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    users: IAdminUser[];
    meta: IUsersMeta;
  };
}