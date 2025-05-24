import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Declaration } from "../declaration.model";
import { DeclarationService } from "../declaration.service";
import { DeclarationFormComponent } from "../declaration-form/declaration-form.component";
import {
  DataTableComponent,
  TableAction,
} from "../../../shared/components/data-table/data-table.component";
import { AuthService } from "../../../core/auth/auth.service";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: "app-pending-declarations",
  standalone: true,
  imports: [CommonModule, DeclarationFormComponent, DataTableComponent],
  templateUrl: "./pending-declaration.component.html",
})
export class PendingDeclarationsComponent implements OnInit {
  declarations: Declaration[] = [];
  formattedDeclarations: any[] = [];
  isDrawerOpen = false;
  selectedDeclaration?: Declaration;
  isLoading = false;
  loadingMessage = "Loading Pending Declarations..";

  columns = [
    { prop: "requestId", name: "#" },
    { prop: "institutionCode", name: "# Code" },
    { prop: "institutionName", name: "Institution" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "currentAgreedDcv", name: "Agreed DCV (MMscf)" },
    { prop: "periodStartDate", name: "From" },
    { prop: "periodEndDate", name: "To" },
    // { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "View Details",
      type: "primary",
    },
    {
      label: "Approve",
      type: "success",
    },
    {
      label: "Decline",
      type: "danger",
    },
    // {
    //   label: "Edit",
    //   type: "primary",
    //   isDisabled: (row: Declaration) => row.status !== "draft",
    // },
    // {
    //   label: "Delete",
    //   type: "danger",
    //   isDisabled: (row: Declaration) => row.status !== "draft",
    // },
  ];

  constructor(
    private declarationService: DeclarationService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Declarations", link: "/declarations" },
      { label: "Pending Declarations", link: "/declarations/pending" },
    ]);

    this.loadPendingDeclarations();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatDeclarations(declarations: Declaration[]) {
    this.formattedDeclarations = declarations.map((declaration) => ({
      ...declaration,
      startDate: this.formatDate(declaration.startDate),
      endDate: this.formatDate(declaration.endDate),
    }));
  }

  loadPendingDeclarations() {
    this.isLoading = true;
    this.declarationService.getPendingDeclarations().subscribe({
      next: (response) => {
        this.formattedDeclarations = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.log({ error });
        this.isLoading = false;
      },
    });
  }

  onActionClick(event: { action: TableAction; row: Declaration }) {
    switch (event.action.label) {
      case "View Details":
        this.router.navigate(["/declarations", event.row.requestId]);
        break;
      case "Approve":
        this.editDeclaration(event.row);
        break;
      case "Decline":
        this.editDeclaration(event.row);
        break;
      case "Edit":
        this.editDeclaration(event.row);
        break;
      case "Delete":
        this.deleteDeclaration(event.row.id);
        break;
    }
  }

  openDrawer() {
    this.selectedDeclaration = undefined;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedDeclaration = undefined;
  }

  editDeclaration(declaration: Declaration) {
    this.selectedDeclaration = declaration;
    this.isDrawerOpen = true;
  }

  saveDeclaration(declarationData: Partial<Declaration>) {
    this.isLoading = true;
    this.loadingMessage = this.selectedDeclaration
      ? "Updating declaration..."
      : "Creating declaration...";

    setTimeout(() => {
      const currentUser = this.authService.getCurrentUser();

      if (this.selectedDeclaration) {
        // Update existing declaration
        const updatedDeclaration: Declaration = {
          ...this.selectedDeclaration,
          ...declarationData,
          updatedAt: new Date(),
        };

        // this.declarationService.updateDeclaration(updatedDeclaration);
        this.notificationService.addNotification({
          title: "Declaration Updated",
          message: `Declaration "${updatedDeclaration.title}" has been updated`,
          type: "success",
        });
      } else {
        // Create new declaration
        const newDeclaration: Omit<
          Declaration,
          "id" | "createdAt" | "updatedAt"
        > = {
          ...declarationData,
          organizationId: currentUser?.organizationId || "",
          createdBy: currentUser?.id || "",
          status: "draft",
        } as Omit<Declaration, "id" | "createdAt" | "updatedAt">;

        // this.declarationService.addDeclaration(newDeclaration);
        this.notificationService.addNotification({
          title: "Declaration Created",
          message: `Declaration "${newDeclaration.title}" has been created`,
          type: "success",
        });
      }

      this.loadPendingDeclarations();
      this.closeDrawer();
    }, 2000);
  }

  deleteDeclaration(id: string) {
    if (confirm("Are you sure you want to delete this declaration?")) {
      this.isLoading = true;
      this.loadingMessage = "Deleting declaration...";

      setTimeout(() => {
        // this.declarationService.deleteDeclaration(id);
        this.notificationService.addNotification({
          title: "Declaration Deleted",
          message: "The declaration has been deleted successfully",
          type: "success",
        });
        this.loadPendingDeclarations();
      }, 2000);
    }
  }
}
