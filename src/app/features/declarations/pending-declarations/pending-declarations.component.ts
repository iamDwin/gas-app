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
import {
  ConfirmationModalComponent,
  ConfirmationModalConfig,
} from "../../../shared/components/confirmation-modal/confirmation-modal.component";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-pending-declarations",
  standalone: true,
  imports: [
    CommonModule,
    DeclarationFormComponent,
    DataTableComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: "./pending-declaration.component.html",
})
export class PendingDeclarationsComponent implements OnInit {
  declarations: Declaration[] = [];
  formattedDeclarations: any[] = [];
  isDrawerOpen = false;
  selectedDeclaration?: Declaration;
  isLoading = false;
  showConfirmModal = false;
  declarationToActivate: any;
  actAction: any;
  loadingMessage = "Loading Pending Declarations..";
  currentUser = this.authService.getCurrentUser();

  columns = [
    { prop: "requestId", name: "#" },
    // { prop: "institutionCode", name: "# Code" },
    // { prop: "institutionName", name: "Institution" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "currentAgreedDcv", name: "Agreed DCV (MMscf)" },
    { prop: "periodStartDate", name: "From" },
    { prop: "periodEndDate", name: "To" },
    { prop: "declarationStatus", name: "Status" },
    { prop: "nominationStatus", name: "Nomination" },
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
      isDisabled: (row: Declaration) => {
        return (
          row.declaredBy == this.currentUser?.name || row.approvedBy !== null
        );
      },
    },
    {
      label: "Decline",
      type: "danger",
      isDisabled: (row: Declaration) => {
        return (
          row.declaredBy == this.currentUser?.name || row.approvedBy !== null
        );
      },
    },
  ];

  approveDeclarationConfig: ConfirmationModalConfig = {
    title: "Approve Declaration",
    message: "Are you sure you want to approve this declaration ?",
    confirmText: "Approve Declaration",
    cancelText: "Cancel",
    type: "warning",
  };
  declineDeclarationConfig: ConfirmationModalConfig = {
    title: "Decline Declaration",
    message: "Are you sure you want to decline this declaration ?",
    confirmText: "Decline Declaration",
    cancelText: "Cancel",
    type: "danger",
  };
  activateModalMessage: ConfirmationModalConfig = this.approveDeclarationConfig;

  constructor(
    private declarationService: DeclarationService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService,
    private router: Router,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Declarations", link: "/declarations" },
      { label: "Pending Declarations", link: "/declarations/pending" },
    ]);

    this.loadPendingDeclarations();
  }

  formatDate(date: string): string {
    const datte = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return datte;
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

  loadPendingDeclarations() {
    this.isLoading = true;
    this.declarationService.getPendingDeclarations().subscribe({
      next: (response) => {
        // this.formattedDeclarations = response;
        this.formatDeclarations(response);
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
        this.declarationAction(event.row, "approve");
        break;
      case "Decline":
        this.declarationAction(event.row, "decline");
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

  declarationAction(data: any, action: string) {
    if (action === "approve")
      this.activateModalMessage = this.approveDeclarationConfig;
    else this.activateModalMessage = this.declineDeclarationConfig;
    this.showConfirmModal = true;
    this.declarationToActivate = data;
    this.actAction = action;
    console.log({ data, action }, this.declarationToActivate);
  }

  cancelActivate() {
    this.showConfirmModal = false;
    this.declarationToActivate = undefined;
    this.actAction = "";
  }

  confirmAction = () => {
    this.isLoading = true;
    this.showConfirmModal = false;
    this.loadingMessage = "Performing Action...";
    let currentUser = this.authService.getCurrentUser();
    let payload = {
      id: this.declarationToActivate.id.toString(),
      by: currentUser?.name,
      comment: `${this.actAction} declaration`,
    };

    if (this.actAction == "approve") {
      this.declarationService
        .approveDeclaration(payload, this.actAction)
        .subscribe({
          next: (response) => {
            // console.log({ response });
            this.isLoading = false;
            this.notificationService.addNotification({
              title: "Declaration Request",
              message: `${response.errorMessage}`,
              type: response.errorCode == "1" ? "error" : "success",
            });
            this.toaster.show({
              title: "Declaration Request",
              message: `${response.errorMessage}`,
              type: response.errorCode == "1" ? "error" : "success",
            });
          },
          error: (error) => {
            this.isLoading = false;
            this.notificationService.addNotification({
              title: "Declaration Request",
              message: `${error.errorMessage}`,
              type: error.errorCode == "1" ? "error" : "success",
            });
            this.toaster.show({
              title: "Declaration Request",
              message: `${error.errorMessage}`,
              type: error.errorCode == "1" ? "error" : "success",
            });
          },
          complete: () => {
            this.isLoading = false;
            this.loadPendingDeclarations();
          },
        });
    } else {
      this.declarationService
        .declineDeclaration(payload, this.actAction)
        .subscribe((response) => {
          // console.log(response);
          this.isLoading = false;
          this.toaster.show({
            title: "Declaration Request",
            message: `${response.errorMessage}`,
            type: response.errorCode == "1" ? "error" : "success",
          });
        });
      this.loadPendingDeclarations();
      this.isLoading = false;
    }
  };

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
