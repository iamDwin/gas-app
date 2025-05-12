import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  Declaration,
  DeclarationApproval,
  DeclarationStatus,
} from "./declaration.model";
import { AuthService } from "../../core/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class DeclarationService {
  private declarations = new BehaviorSubject<Declaration[]>([
    {
      id: "1",
      title: "Q1 2024 Environmental Report",
      description: "Environmental impact assessment for Q1 2024",
      status: "pending_org_approval",
      organizationId: "1",
      createdBy: "1",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      uploadedBy: "1",
      institutionCode: "ENV001",
      declaredQuantity: 1000,
      startDate: new Date("2024-01-01").toISOString(),
      endDate: new Date("2024-03-31").toISOString(),
    },
    {
      id: "2",
      title: "Annual Safety Compliance",
      description: "Annual safety standards compliance report",
      status: "approved",
      organizationId: "2",
      createdBy: "2",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-16"),
      uploadedBy: "2",
      institutionCode: "SAF001",
      declaredQuantity: 500,
      startDate: new Date("2024-01-01").toISOString(),
      endDate: new Date("2024-12-31").toISOString(),
    },
    {
      id: "3",
      title: "Waste Management Plan",
      description: "Updated waste management procedures",
      status: "draft",
      organizationId: "1",
      createdBy: "3",
      createdAt: new Date("2024-01-13"),
      updatedAt: new Date("2024-01-13"),
      uploadedBy: "3",
      institutionCode: "WST001",
      declaredQuantity: 750,
      startDate: new Date("2024-01-01").toISOString(),
      endDate: new Date("2024-12-31").toISOString(),
    },
    {
      id: "4",
      title: "Carbon Emissions Report",
      description: "Monthly carbon emissions tracking",
      status: "pending_admin_approval",
      organizationId: "3",
      createdBy: "4",
      createdAt: new Date("2024-01-12"),
      updatedAt: new Date("2024-01-14"),
      uploadedBy: "4",
      institutionCode: "CRB001",
      declaredQuantity: 2500,
      startDate: new Date("2024-01-01").toISOString(),
      endDate: new Date("2024-01-31").toISOString(),
    },
    {
      id: "5",
      title: "Resource Utilization Review",
      description: "Quarterly resource usage analysis",
      status: "rejected",
      organizationId: "2",
      createdBy: "2",
      createdAt: new Date("2024-01-11"),
      updatedAt: new Date("2024-01-15"),
      rejectedBy: "1",
      rejectedAt: new Date("2024-01-15"),
      rejectionReason: "Incomplete data provided",
      uploadedBy: "2",
      institutionCode: "RES001",
      declaredQuantity: 1200,
      startDate: new Date("2024-01-01").toISOString(),
      endDate: new Date("2024-03-31").toISOString(),
    },
  ]);

  private approvals = new BehaviorSubject<DeclarationApproval[]>([]);

  constructor(private authService: AuthService) {}

  getDeclarations(): Observable<Declaration[]> {
    return this.declarations.asObservable();
  }

  getDeclarationsForOrganization(
    organizationId: string
  ): Observable<Declaration[]> {
    return new Observable((subscriber) => {
      const filtered = this.declarations.value.filter(
        (d) => d.organizationId === organizationId
      );
      subscriber.next(filtered);
    });
  }

  getPendingApprovals(): Observable<Declaration[]> {
    const user = this.authService.getCurrentUser();

    return new Observable((subscriber) => {
      let filtered: Declaration[];

      if (this.authService.isAdmin()) {
        filtered = this.declarations.value.filter(
          (d) => d.status === "pending_admin_approval"
        );
      } else if (user?.organizationId) {
        filtered = this.declarations.value.filter(
          (d) =>
            d.organizationId === user.organizationId &&
            d.status === "pending_org_approval"
        );
      } else {
        filtered = [];
      }

      subscriber.next(filtered);
    });
  }

  addDeclaration(
    declaration: Omit<Declaration, "id" | "createdAt" | "updatedAt" | "status">
  ): void {
    const user = this.authService.getCurrentUser();
    const newDeclaration: Declaration = {
      ...declaration,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending_org_approval" as DeclarationStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.declarations.next([...this.declarations.value, newDeclaration]);
  }

  updateDeclaration(declaration: Declaration): void {
    const updated = this.declarations.value.map((d) =>
      d.id === declaration.id ? { ...declaration, updatedAt: new Date() } : d
    );
    this.declarations.next(updated);
  }

  approveDeclaration(declarationId: string, comments?: string): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const declaration = this.declarations.value.find(
      (d) => d.id === declarationId
    );
    if (!declaration) return;

    const approval: DeclarationApproval = {
      declarationId,
      approverId: user.id,
      approvedAt: new Date(),
      level: this.authService.isAdmin() ? "admin" : "organization",
      status: "approved",
      comments,
    };

    const updatedDeclaration = {
      ...declaration,
      status: this.authService.isAdmin()
        ? ("approved" as DeclarationStatus)
        : ("pending_admin_approval" as DeclarationStatus),
      updatedAt: new Date(),
      approvedBy: user.id,
      approvedAt: new Date(),
    };

    this.approvals.next([...this.approvals.value, approval]);
    this.updateDeclaration(updatedDeclaration);
  }

  rejectDeclaration(declarationId: string, reason: string): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const declaration = this.declarations.value.find(
      (d) => d.id === declarationId
    );
    if (!declaration) return;

    const approval: DeclarationApproval = {
      declarationId,
      approverId: user.id,
      approvedAt: new Date(),
      level: this.authService.isAdmin() ? "admin" : "organization",
      status: "rejected",
      comments: reason,
    };

    const updatedDeclaration = {
      ...declaration,
      status: "rejected" as DeclarationStatus,
      updatedAt: new Date(),
      rejectedBy: user.id,
      rejectedAt: new Date(),
      rejectionReason: reason,
    };

    this.approvals.next([...this.approvals.value, approval]);
    this.updateDeclaration(updatedDeclaration);
  }

  deleteDeclaration(id: string): void {
    const filtered = this.declarations.value.filter((d) => d.id !== id);
    this.declarations.next(filtered);
  }
}
