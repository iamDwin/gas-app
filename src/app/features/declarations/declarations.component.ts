import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Declaration } from "./declaration.model";
import { DeclarationService } from "./declaration.service";
import { DeclarationFormComponent } from "./declaration-form/declaration-form.component";
import {
  DataTableComponent,
  TableAction,
} from "../../shared/components/data-table/data-table.component";
import { AuthService, User } from "../../core/auth/auth.service";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { NotificationService } from "../../shared/services/notification.service";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { ToastService } from "../../shared/services/toast.service";

@Component({
  selector: "app-declarations",
  standalone: true,
  imports: [
    CommonModule,
    DeclarationFormComponent,
    DataTableComponent,
    ButtonComponent,
  ],
  templateUrl: "./declaration.component.html",
})
export class DeclarationsComponent implements OnInit {
  declarations: Declaration[] = [];
  formattedDeclarations: any[] = [];
  isDrawerOpen = false;
  selectedDeclaration?: Declaration;
  isLoading = false;
  loadingMessage = "Loading Declarations...";
  currentUser: User | null = null;

  columns = [
    // { prop: "id", name: "#" },
    // { prop: "institutionCode", name: "# Code" },
    { prop: "institutionName", name: "Institution" },
    { prop: "currentAgreedDcv", name: "Contract DCV (MMscf)" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "periodStartDate", name: "From" },
    { prop: "periodEndDate", name: "To" },
    { prop: "declarationStatus", name: "Declaration" },
    { prop: "nominationStatus", name: "Nomination" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "View Details",
      type: "primary",
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
    private notify: NotificationService,
    private router: Router,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    this.breadcrumbService.setBreadcrumbs([
      { label: "Declarations", link: "/declarations" },
    ]);

    this.loadDeclarations();
  }

  isUserAdmin(): boolean {
    return this.currentUser?.role === "admin";
  }

  isGasCompanyAdmin(): boolean {
    return this.currentUser?.type === "G";
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
      periodStartDate: this.formatDate(declaration.periodStartDate),
      periodEndDate: this.formatDate(declaration.periodEndDate),
      declarationStatus: this.getDeclarationStatus(
        declaration.declarationStatus
      ),
      nominationStatus: this.getDeclarationStatus(declaration.nominationStatus),
    }));
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

  loadDeclarations() {
    this.isLoading = true;
    this.declarationService.getDeclarations().subscribe({
      next: (response: any) => {
        // this.formattedDeclarations = response;
        this.formatDeclarations(response);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.log({ error });
        this.toaster.show({
          title: "Declaration Request",
          message: "Failed To Get Declarations, Please Try Again",
          type: "error",
        });
      },
    });
  }

  onActionClick(event: { action: TableAction; row: Declaration }) {
    switch (event.action.label) {
      case "View Details":
        this.router.navigate(["/declarations", event.row.requestId]);
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

  saveDeclaration(payload: Partial<Declaration>) {
    this.isLoading = true;
    this.loadingMessage = this.selectedDeclaration
      ? "Updating declaration..."
      : "Creating declaration...";

    if (this.selectedDeclaration) {
      // Update existing declaration
      const updatedDeclaration: Declaration = {
        ...this.selectedDeclaration,
        ...payload,
        updatedAt: new Date(),
      };

      // this.declarationService.updateDeclaration(updatedDeclaration);
      // this.notify.addNotification({
      //   title: "Declaration Updated",
      //   message: `Declaration "${updatedDeclaration.title}" has been updated`,
      //   type: "success",
      // });
    } else {
      this.declarationService.createDeclaration(payload).subscribe({
        next: (response) => {
          this.toaster.show({
            title: "Create Declaration Action",
            message: `${response.errorMessage}`,
            type: response.errorCode == "1" ? "error" : "success",
          });
          this.router.navigateByUrl("/declarations/pending");
        },
        error: (errorResponse) => {
          this.toaster.show({
            title: "Create Declaration Action",
            message: `${errorResponse.errorMessage}`,
            type: errorResponse.errorCode == "1" ? "error" : "success",
          });
        },
      });
    }

    this.loadDeclarations();
    this.closeDrawer();
  }

  deleteDeclaration(id: string) {
    if (confirm("Are you sure you want to delete this declaration?")) {
      this.isLoading = true;
      this.loadingMessage = "Deleting declaration...";

      setTimeout(() => {
        // this.declarationService.deleteDeclaration(id);
        this.notify.addNotification({
          title: "Declaration Deleted",
          message: "The declaration has been deleted successfully",
          type: "success",
        });
        this.loadDeclarations();
      }, 2000);
    }
  }
}
