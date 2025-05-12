import { AuthResponse } from "../../core/auth/auth.service";

export interface Organization {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  dcv: number;
  type: string;
  code: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  action?: string;
  authStatus?: number;
  initiatorComment?: string;
  initiatedByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  approverComment?: string;
  approvedAt?: string;
  oldRecord?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  email: string;
  address: string;
  phone: string;
  dcv: number;
  type: "Upstream" | "Downstream";
}

export interface OrganizationsResponse {
  errorCode: string;
  errorMessage: string;
  institutionList: Organization[];
}

export interface PendingOrganizationsResponse {
  errorCode: string;
  errorMessage: string;
  institutionList: Organization[];
}
