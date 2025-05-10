import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Organization } from "../organization.model";
import { OrganizationService } from "../organization.service";
import {
  DataTableComponent,
  TableAction,
} from "../../../shared/components/data-table/data-table.component";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { LoadingService } from "../../../core/services/loading.service";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-pending-organizations",
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="p-4">
      <app-data-table
        [rows]="organizations"
        [columns]="columns"
        [actions]="actions"
        [loading]="isLoading"
        [loadingMessage]="loadingMessage"
        defaultSort="name"
        (actionClick)="onActionClick($event)"
      >
      </app-data-table>
    </div>
  `,
})
export class PendingOrganizationsComponent implements OnInit {
  organizations: Organization[] = [];
  isLoading = false;
  loadingMessage = "Loading pending organizations...";

  columns = [
    { prop: "name", name: "Name" },
    { prop: "code", name: "Code" },
    { prop: "email", name: "Email" },
    { prop: "phone", name: "Phone" },
    { prop: "address", name: "Address" },
    {
      prop: "type",
      name: "Type",
      transform: (value: string) => (value === "U" ? "Upstream" : "Downstream"),
    },
    { prop: "action", name: "Request" },
    { prop: "initiatedByName", name: "Initiated By" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "Approve",
      type: "success",
    },
    {
      label: "Reject",
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
      { label: "Pending Approvals", link: "/organizations/pending" },
    ]);

    this.loadPendingOrganizations();
  }

  loadPendingOrganizations() {
    this.isLoading = true;
    this.organizationService.getPendingOrganizations().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.addNotification({
          title: "Organization Request",
          message: "Failed To Get Pending Institutions, Please Try Again",
          type: "error",
        });
        this.toastService.show({
          title: "Organization Request",
          message: "Failed To Get Pending Institutions, Please Try Again",
          type: "error",
        });
        this.isLoading = false;
      },
    });
  }

  onActionClick(event: { action: TableAction; row: Organization }) {
    switch (event.action.label) {
      case "Approve":
        this.approveOrganization(event.row);
        break;
      case "Reject":
        this.rejectOrganization(event.row);
        break;
    }
  }

  approveOrganization(org: Organization) {
    this.loadingService.show("Approving organization...");
    this.organizationService.approveOrganization(org.id).subscribe({
      next: (response) => {
        this.notificationService.addNotification({
          title: "Organization Action",
          message: `${org.name} has been approved successfully`,
          type: response.errorCode == 0 ? "success" : "error",
        });
        this.toastService.show({
          title: "Organization Action",
          message: `${response.errorMessage}`,
          type: response.errorCode == 0 ? "success" : "error",
        });
        this.loadingService.hide();
        this.loadPendingOrganizations();
      },
      error: (error) => {
        this.notificationService.addNotification({
          title: "Error",
          message: "Failed to perform action on organization",
          type: "error",
        });
        this.toastService.show({
          title: "Error",
          message: "Failed to perform action on organization",
          type: "error",
        });
        this.loadingService.hide();
      },
    });
  }

  rejectOrganization(org: Organization) {
    // const reason = prompt("Please provide a reason for rejection:");
    // if (reason) {

    this.loadingService.show("Rejecting organization...");
    this.organizationService.rejectOrganization(org.id).subscribe({
      next: (response) => {
        this.notificationService.addNotification({
          title: "Organization Action",
          message: `${org.name} has been rejected`,
          type: "success",
        });

        this.toastService.show({
          title: "Organization Action",
          message: `${response.errorMessage}`,
          type: response.errorCode == 0 ? "success" : "error",
        });

        this.loadingService.hide();
        this.loadPendingOrganizations();
      },
      error: (error) => {
        console.error("Error rejecting organization:", error);
        this.notificationService.addNotification({
          title: "Error",
          message: "Failed to reject organization",
          type: "error",
        });
        this.loadingService.hide();
      },
    });
    // }
  }
}
