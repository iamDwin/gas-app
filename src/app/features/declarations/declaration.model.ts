export type DeclarationStatus = 'draft' | 'pending_org_approval' | 'pending_admin_approval' | 'approved' | 'rejected';

export interface Declaration {
  id: string;
  title: string;
  description: string;
  status: DeclarationStatus;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface DeclarationApproval {
  declarationId: string;
  approverId: string;
  approvedAt: Date;
  level: 'organization' | 'admin';
  status: 'approved' | 'rejected';
  comments?: string;
}