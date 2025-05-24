import {
  Nomination,
  DailyQuantity,
  NominationStatus,
  NominationApproval,
} from "./nominations.model";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class NominationService {
  private apiUrl = environment.apiUrl;
  // private declarations = new BehaviorSubject<Nomination[]>([
  //   {
  //     id: "1",
  //     title: "January 2024 Nomination",
  //     description: "Monthly declaration for January 2024",
  //     status: "pending_org_approval",
  //     organizationId: "1",
  //     createdBy: "1",
  //     createdAt: new Date("2024-01-15"),
  //     updatedAt: new Date("2024-01-15"),
  //     uploadedBy: "1",
  //     institutionCode: "ENV001",
  //     declaredQuantity: 1000,
  //     startDate: "2024-01-01",
  //     endDate: "2024-01-31",
  //     dailyQuantities: this.generateDailyQuantities(
  //       "2024-01-01",
  //       "2024-01-31",
  //       1000,
  //       0.2
  //     ),
  //   },
  //   {
  //     id: "2",
  //     title: "February 2024 Nomination",
  //     description: "Monthly declaration for February 2024",
  //     status: "approved",
  //     organizationId: "2",
  //     createdBy: "2",
  //     createdAt: new Date("2024-02-01"),
  //     updatedAt: new Date("2024-02-01"),
  //     uploadedBy: "2",
  //     institutionCode: "SAF001",
  //     declaredQuantity: 500,
  //     startDate: "2024-02-01",
  //     endDate: "2024-02-29",
  //     dailyQuantities: this.generateDailyQuantities(
  //       "2024-02-01",
  //       "2024-02-29",
  //       500,
  //       0.15
  //     ),
  //   },
  //   {
  //     id: "3",
  //     title: "March 2024 Nomination",
  //     description: "Monthly declaration for March 2024",
  //     status: "draft",
  //     organizationId: "1",
  //     createdBy: "3",
  //     createdAt: new Date("2024-03-01"),
  //     updatedAt: new Date("2024-03-01"),
  //     uploadedBy: "3",
  //     institutionCode: "WST001",
  //     declaredQuantity: 750,
  //     startDate: "2024-03-01",
  //     endDate: "2024-03-31",
  //     dailyQuantities: this.generateDailyQuantities(
  //       "2024-03-01",
  //       "2024-03-31",
  //       750,
  //       0.1
  //     ),
  //   },
  // ]);
  nominations: Nomination[] = [];
  // private approvals = new BehaviorSubject<NominationApproval[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();

    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  getDeclarations = () => {
    const user = this.authService.getCurrentUser();
    let path = "";
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    if (user.type == "M" || user.type == "G")
      path = `get_approved_declarations_midstream/${user.name}`;
    else path = `get_approved_declarations/${user.organizationId}/${user.name}`;

    return this.http
      .get<any>(`${this.apiUrl}/declaration/api/v1/${path}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response || []));
  };

  // private generateDailyQuantities(
  //   startDate: string,
  //   endDate: string,
  //   baseQuantity: number,
  //   variationPercentage: number
  // ): DailyQuantity[] {
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   const dailyQuantities: DailyQuantity[] = [];
  //   const maxVariation = baseQuantity * variationPercentage;

  //   for (
  //     let date = new Date(start);
  //     date <= end;
  //     date.setDate(date.getDate() + 1)
  //   ) {
  //     const variation = (Math.random() * 2 - 1) * maxVariation;
  //     const quantity = Math.round(baseQuantity + variation);

  //     dailyQuantities.push({
  //       date: date.toISOString().split("T")[0],
  //       quantity: Math.max(0, quantity),
  //     });
  //   }

  //   return dailyQuantities;
  // }

  // getDeclarations(): Observable<Nomination[]> {
  //   return this.declarations.asObservable();
  // }

  // getDeclaration(id: string): Observable<Nomination | undefined> {
  //   return new Observable((subscriber) => {
  //     const declaration = this.declarations.value.find((d) => d.id === id);
  //     subscriber.next(declaration);
  //     subscriber.complete();
  //   });
  // }

  // updateDailyQuantity(
  //   declarationId: string,
  //   date: string,
  //   quantity: number
  // ): void {
  //   const updated = this.declarations.value.map((d) => {
  //     if (d.id === declarationId) {
  //       const updatedQuantities = d.dailyQuantities.map((dq) =>
  //         dq.date === date ? { ...dq, quantity } : dq
  //       );
  //       return {
  //         ...d,
  //         dailyQuantities: updatedQuantities,
  //         updatedAt: new Date(),
  //       };
  //     }
  //     return d;
  //   });
  //   this.declarations.next(updated);
  // }

  // private getMonthEndDate(startDate: string): string {
  //   const date = new Date(startDate);
  //   date.setMonth(date.getMonth() + 1);
  //   date.setDate(0);
  //   return date.toISOString().split("T")[0];
  // }

  // getDeclarationsForOrganization(
  //   organizationId: string
  // ): Observable<Nomination[]> {
  //   return new Observable((subscriber) => {
  //     const filtered = this.declarations.value.filter(
  //       (d) => d.organizationId === organizationId
  //     );
  //     subscriber.next(filtered);
  //   });
  // }

  // getPendingApprovals(): Observable<Nomination[]> {
  //   const user = this.authService.getCurrentUser();

  //   return new Observable((subscriber) => {
  //     let filtered: Nomination[];

  //     if (this.authService.isAdmin()) {
  //       filtered = this.declarations.value.filter(
  //         (d) => d.status === "pending_admin_approval"
  //       );
  //     } else if (user?.organizationId) {
  //       filtered = this.declarations.value.filter(
  //         (d) =>
  //           d.organizationId === user.organizationId &&
  //           d.status === "pending_org_approval"
  //       );
  //     } else {
  //       filtered = [];
  //     }

  //     subscriber.next(filtered);
  //   });
  // }

  // addDeclaration(
  //   declaration: Omit<Nomination, "id" | "createdAt" | "updatedAt" | "status">
  // ): void {
  //   const user = this.authService.getCurrentUser();

  //   const endDate = this.getMonthEndDate(declaration.startDate);

  //   const newDeclaration: Nomination = {
  //     ...declaration,
  //     id: Math.random().toString(36).substring(2),
  //     status: "pending_org_approval" as NominationStatus,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     endDate,
  //     dailyQuantities: this.generateDailyQuantities(
  //       declaration.startDate,
  //       endDate,
  //       declaration.declaredQuantity,
  //       0.2
  //     ),
  //   };
  //   this.declarations.next([...this.declarations.value, newDeclaration]);
  // }

  // updateDeclaration(declaration: Nomination): void {
  //   const updated = this.declarations.value.map((d) =>
  //     d.id === declaration.id ? { ...declaration, updatedAt: new Date() } : d
  //   );
  //   this.declarations.next(updated);
  // }

  // approveDeclaration(declarationId: string, comments?: string): void {
  //   const user = this.authService.getCurrentUser();
  //   if (!user) return;

  //   const declaration = this.declarations.value.find(
  //     (d) => d.id === declarationId
  //   );
  //   if (!declaration) return;

  //   const approval: NominationApproval = {
  //     declarationId,
  //     approverId: user.id,
  //     approvedAt: new Date(),
  //     level: this.authService.isAdmin() ? "admin" : "organization",
  //     status: "approved",
  //     comments,
  //   };

  //   const updatedDeclaration = {
  //     ...declaration,
  //     status: this.authService.isAdmin()
  //       ? ("approved" as NominationStatus)
  //       : ("pending_admin_approval" as NominationStatus),
  //     updatedAt: new Date(),
  //     approvedBy: user.id,
  //     approvedAt: new Date(),
  //   };

  //   this.approvals.next([...this.approvals.value, approval]);
  //   this.updateDeclaration(updatedDeclaration);
  // }

  // rejectDeclaration(declarationId: string, reason: string): void {
  //   const user = this.authService.getCurrentUser();
  //   if (!user) return;

  //   const declaration = this.declarations.value.find(
  //     (d) => d.id === declarationId
  //   );
  //   if (!declaration) return;

  //   const approval: NominationApproval = {
  //     declarationId,
  //     approverId: user.id,
  //     approvedAt: new Date(),
  //     level: this.authService.isAdmin() ? "admin" : "organization",
  //     status: "rejected",
  //     comments: reason,
  //   };

  //   const updatedDeclaration = {
  //     ...declaration,
  //     status: "rejected" as NominationStatus,
  //     updatedAt: new Date(),
  //     rejectedBy: user.id,
  //     rejectedAt: new Date(),
  //     rejectionReason: reason,
  //   };

  //   this.approvals.next([...this.approvals.value, approval]);
  //   this.updateDeclaration(updatedDeclaration);
  // }

  // deleteDeclaration(id: string): void {
  //   const filtered = this.declarations.value.filter((d) => d.id !== id);
  //   this.declarations.next(filtered);
  // }
}
