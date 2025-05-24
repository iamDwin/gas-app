export type DeclarationStatus =
  | "draft"
  | "pending_org_approval"
  | "pending_admin_approval"
  | "approved"
  | "rejected";

export interface DailyQuantity {
  date: string;
  quantity: number;
}

export interface Declaration {
  id: string;
  title: string;
  description: string;
  status: DeclarationStatus;
  organizationId: string;
  createdBy: string;
  uploadedBy: string;
  institutionCode: string;
  declaredQuantity: number;
  startDate: string;
  endDate: string;
  dailyQuantities: DailyQuantity[];
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  requestId: string;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface DailyViewDeclaration {
  id: number;
  requestId: string;
  declaredQuantity: number;
  confirmedQuantity: null;
  date: string;
  declaredBy: string;
  declaredByName: string;
  confirmedBy: null;
  confirmedByName: null;
  institutionCode: string;
  institutionName: string;
  type: string;
  comment: null;
  createdAt: string;
  status: number;
}

export interface CreateDeclarationRequest {
  uploadedBy: string;
  institutionCode: string;
  declaredQuantity: number;
  startDate: string;
  endDate: string;
}

export interface DeclarationApproval {
  declarationId: string;
  approverId: string;
  approvedAt: Date;
  level: "organization" | "admin";
  status: "approved" | "rejected";
  comments?: string;
}
