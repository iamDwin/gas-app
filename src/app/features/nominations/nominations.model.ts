export type NominationStatus =
  | "draft"
  | "pending_org_approval"
  | "pending_admin_approval"
  | "approved"
  | "rejected";

export interface DailyQuantity {
  date: string;
  quantity: number;
}

export interface Nomination {
  id: string;
  title: string;
  description: string;
  status: NominationStatus;
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
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  periodEndDate: string;
  periodStartDate: string;
}

export interface CreateNominationRequest {
  uploadedBy: string;
  institutionCode: string;
  declaredQuantity: number;
  startDate: string;
  endDate: string;
}

export interface NominationApproval {
  declarationId: string;
  approverId: string;
  approvedAt: Date;
  level: "organization" | "admin";
  status: "approved" | "rejected";
  comments?: string;
}
