import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import {
  DataTableComponent,
  TableAction,
} from "../../../shared/components/data-table/data-table.component";
import { Declaration } from "../declaration.model";
import { AuthService } from "../../../core/auth/auth.service";
import { Router } from "@angular/router";
import { DeclarationService } from "../declaration.service";

@Component({
  selector: "app-declined-declarations",
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: "./declined-declarations.component.html",
})
export class DeclinedDeclarationsComponent implements OnInit {
  declarations: Declaration[] = [];
  formattedDeclarations: any[] = [];
  isDrawerOpen = false;
  selectedDeclaration?: Declaration;
  isLoading = false;
  showConfirmModal = false;
  declarationToActivate: any;
  actAction: any;
  loadingMessage = "Loading Declined Declarations..";
  currentUser = this.authService.getCurrentUser();

  columns = [
    { prop: "currentAgreedDcv", name: "Contract DCV (MMscf)" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "periodStartDate", name: "From" },
    { prop: "periodEndDate", name: "To" },
    { prop: "declarationStatus", name: "Status" },
    // { prop: "actions", name: "Actions" },
  ];

  actions: TableAction[] = [
    {
      label: "View Details",
      type: "primary",
    },
  ];

  constructor(
    private breadcrumService: BreadcrumbService,
    private authService: AuthService,
    private router: Router,
    private declarationService: DeclarationService
  ) {}

  ngOnInit(): void {
    this.breadcrumService.setBreadcrumbs([
      { label: "Declarations", link: "/declarations" },
      { label: "Declined Declarations", link: "/declarations/declined" },
    ]);

    this.loadDeclinedDeclarations();
  }

  loadDeclinedDeclarations() {
    this.isLoading = true;
    this.declarationService.getDeclinedDeclarations().subscribe({
      next: (response) => {
        this.formatDeclarations(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.log({ error });
        this.isLoading = false;
      },
    });
  }

  formatDate(date: string): string {
    const datte = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return datte;
  }

  getDeclarationStatus(status: number): string {
    switch (status) {
      case 0:
        return "Pending Approval";
      case 1:
        return "Approved";
      case 2:
        return "Declined";
      default:
        return "Unknown Status";
    }
  }

  formatDeclarations(declarations: Declaration[]) {
    this.formattedDeclarations = declarations.map((declaration) => ({
      ...declaration,
      periodStartDate: this.formatDate(declaration.periodStartDate),
      periodEndDate: this.formatDate(declaration.periodEndDate),
      declarationStatus: this.getDeclarationStatus(
        declaration.declarationStatus
      ),
      nominationStatus: this.getDeclarationStatus(declaration.nominationStatus),
    }));
  }

  onActionClick(event: { action: TableAction; row: Declaration }) {
    switch (event.action.label) {
      case "View Details":
        this.router.navigate(["/declarations", event.row.requestId]);
        break;
    }
  }
}
