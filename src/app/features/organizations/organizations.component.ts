import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Organization, CreateOrganizationRequest } from "./organization.model";
import { OrganizationService } from "./organization.service";
import { OrganizationFormComponent } from "./organization-form/organization-form.component";
import {
  DataTableComponent,
  TableAction,
} from "../../shared/components/data-table/data-table.component";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { NotificationService } from "../../shared/services/notification.service";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { LoadingService } from "../../core/services/loading.service";
import {
  ConfirmationModalComponent,
  ConfirmationModalConfig,
} from "../../shared/components/confirmation-modal/confirmation-modal.component";
import { ToastService } from "../../shared/services/toast.service";

@Component({
  selector: "app-organizations",
  standalone: true,
  imports: [
    CommonModule,
    OrganizationFormComponent,
    DataTableComponent,
    ButtonComponent,
    ConfirmationModalComponent,
  ],
  template: `
    <div class="p-4">
      <app-data-table
        [rows]="organizations"
        [columns]="columns"
        [actions]="actions"
        [loading]="isLoading"
        defaultSort="name"
        (actionClick)="onActionClick($event)"
      >
        <div tableActions>
          <app-button
            variant="filled"
            (click)="openDrawer()"
            [iconLeft]="
              '<svg class=&quot;w-5 h-5&quot; fill=&quot;none&quot; viewBox=&quot;0 0 24 24&quot; stroke=&quot;currentColor&quot;><path stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; stroke-width=&quot;2&quot; d=&quot;M12 6v6m0 0v6m0-6h6m-6 0H6&quot;/></svg>'
            "
          >
            Add Organization
          </app-button>
        </div>
      </app-data-table>

      <!-- Drawer -->
      <div
        class="drawer"
        [class.drawer-open]="isDrawerOpen"
        [class.drawer-closed]="!isDrawerOpen"
      >
        <app-organization-form
          *ngIf="isDrawerOpen"
          [organization]="selectedOrganization"
          (save)="saveOrganization($event)"
          (onCancel)="closeDrawer()"
        ></app-organization-form>
      </div>

      <!-- Backdrop -->
      <div
        *ngIf="isDrawerOpen"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
        (click)="closeDrawer()"
      ></div>

      <!-- Confirmation Modal -->
      <app-confirmation-modal
        [show]="showDeleteModal"
        [config]="deleteModalConfig"
        (onConfirm)="confirmDelete()"
        (onCancel)="cancelDelete()"
      ></app-confirmation-modal>
    </div>
  `,
})
export class OrganizationsComponent implements OnInit {
  organizations: Organization[] = [];
  isDrawerOpen = false;
  selectedOrganization?: Organization;
  isLoading = false;
  showDeleteModal = false;
  organizationToDelete?: Organization;

  deleteModalConfig: ConfirmationModalConfig = {
    title: "Delete Organization",
    message:
      "Are you sure you want to delete this organization? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  };

  columns = [
    { prop: "name", name: "Name" },
    { prop: "email", name: "Email" },
    { prop: "phone", name: "Phone" },
    { prop: "address", name: "Address" },
    { prop: "type", name: "Type" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "Edit",
      type: "primary",
    },
    {
      label: "Delete",
      type: "danger",
    },
  ];

  constructor(
    private organizationService: OrganizationService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Organizations", link: "/organizations" },
    ]);

    this.loadOrganizations();
  }

  loadOrganizations() {
    this.isLoading = true;
    this.organizationService.getOrganizations().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.addNotification({
          title: "Error",
          message: "Failed to load organizations",
          type: "error",
        });
        this.isLoading = false;
      },
    });
  }

  onActionClick(event: { action: TableAction; row: Organization }) {
    switch (event.action.label) {
      case "Edit":
        this.editOrganization(event.row);
        break;
      case "Delete":
        this.showDeleteConfirmation(event.row);
        break;
    }
  }

  openDrawer() {
    this.selectedOrganization = undefined;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedOrganization = undefined;
  }

  editOrganization(org: Organization) {
    this.selectedOrganization = org;
    this.isDrawerOpen = true;
  }

  showDeleteConfirmation(organization: Organization) {
    this.organizationToDelete = organization;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.organizationToDelete) {
      this.loadingService.show("Deleting organization...");
      this.organizationService
        .deleteOrganization(this.organizationToDelete.id)
        .subscribe({
          next: (response: any) => {
            console.log({ response });
            this.notificationService.addNotification({
              title: "Organization Delete Request",
              message: response.errorMessage,
              type: response.errorCode === "0" ? "success" : "error",
            });

            this.toastService.show({
              title: "Organization Delete Request",
              message: response.errorMessage,
              type: response.errorCode === "0" ? "success" : "error",
            });

            this.loadingService.hide();
            this.loadOrganizations();
          },
          error: (error) => {
            this.notificationService.addNotification({
              title: "Error",
              message: "Failed to delete organization",
              type: "error",
            });
            this.loadingService.hide();
          },
        });
    }
    this.showDeleteModal = false;
    this.organizationToDelete = undefined;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.organizationToDelete = undefined;
  }

  saveOrganization(orgData: CreateOrganizationRequest) {
    this.loadingService.show(
      this.selectedOrganization
        ? "Updating organization..."
        : "Creating organization..."
    );

    if (this.selectedOrganization) {
      this.organizationService
        .updateOrganization({
          ...this.selectedOrganization,
          ...orgData,
        })
        .subscribe({
          next: () => {
            this.notificationService.addNotification({
              title: "Organization Updated",
              message: `${orgData.name} has been updated successfully`,
              type: "success",
            });
            this.loadingService.hide();
            this.closeDrawer();
            this.loadOrganizations();
          },
          error: (error) => {
            this.notificationService.addNotification({
              title: "Error",
              message: "Failed to update organization",
              type: "error",
            });
            this.loadingService.hide();
          },
        });
    } else {
      this.organizationService.addOrganization(orgData).subscribe({
        next: (org) => {
          this.notificationService.addNotification({
            title: "Organization Created",
            message: `${orgData.name} has been created successfully`,
            type: "success",
          });
          this.loadingService.hide();
          this.closeDrawer();
          this.loadOrganizations();
        },
        error: (error) => {
          this.notificationService.addNotification({
            title: "Error",
            message: "Failed to create organization",
            type: "error",
          });
          this.loadingService.hide();
        },
      });
    }
  }
}
