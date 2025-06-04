import { Component, OnInit } from "@angular/core";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";
import {
  DataTableComponent,
  TableAction,
} from "../../../shared/components/data-table/data-table.component";
import { Declaration } from "../../declarations/declaration.model";
import { CommonModule } from "@angular/common";
import { NominationService } from "../nominations.service";

@Component({
  selector: "app-declined-nominations",
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: "./declined-nominations.component.html",
  // styleUrl: "./declined-nominations.component.css",
})
export class DeclinedNominationsComponent implements OnInit {
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
    { prop: "declaredQuantity", name: "Declared DCV (MMscf)" },
    { prop: "periodStartDate", name: "From" },
    { prop: "periodEndDate", name: "To" },
    { prop: "nominationStatus", name: "Status" },
    // { prop: "actions", name: "Actions" },
  ];

  actions: TableAction[] = [
    {
      label: "View Details",
      type: "primary",
    },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private authService: AuthService,
    private router: Router,
    private nominationService: NominationService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Nominations", link: "/nominations" },
      { label: "Declined Nominations", link: "/nominations/declined" },
    ]);

    this.loadDeclinedDeclarations();
  }

  loadDeclinedDeclarations() {
    this.isLoading = true;
    this.nominationService.getDeclinedNominations().subscribe({
      next: (response) => {
        console.log({ response });
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
      declarationStatus: this.getDeclarationStatus(declaration.status),
      nominationStatus: this.getDeclarationStatus(declaration.status),
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
