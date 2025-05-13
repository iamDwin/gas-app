import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User } from "../user.model";
import { UserService } from "../user.service";
import {
  DataTableComponent,
  TableAction,
} from "../../../shared/components/data-table/data-table.component";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { LoadingService } from "../../../core/services/loading.service";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-pending-users",
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="p-4">
      <app-data-table
        [rows]="users"
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
export class PendingUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  loadingMessage = "Loading pending users...";

  columns = [
    { prop: "fullName", name: "Name" },
    { prop: "email", name: "Email" },
    { prop: "roleName", name: "Role" },
    { prop: "institutionName", name: "institution" },
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
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Users", link: "/users" },
      { label: "Pending Users", link: "/users/pending" },
    ]);

    this.loadPendingUsers();
  }

  loadPendingUsers() {
    this.isLoading = true;
    this.userService.getPendingUsers().subscribe({
      next: (response) => {
        console.log({ response });
        this.users = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.addNotification({
          title: "Error",
          message: "Failed To Get Pending Users, Please Try Again",
          type: "error",
        });
        this.toastService.show({
          title: "Error",
          message: "Failed To Get Pending Users, Please Try Again",
          type: "error",
        });
        this.isLoading = false;
      },
    });
  }

  onActionClick(event: { action: TableAction; row: User }) {
    switch (event.action.label) {
      case "Approve":
        this.approveUser(event.row);
        break;
      case "Reject":
        // this.rejectOrganization(event.row);
        break;
    }
  }

  approveUser(user: User) {
    this.loadingService.show("Approving User...");
    this.userService.approveUser(user.id).subscribe({
      next: (response: any) => {
        this.notificationService.addNotification({
          title: "User Action",
          message: `${response.errorMessage}`,
          type: response.errorCode == 0 ? "success" : "error",
        });
        this.toastService.show({
          title: "Organization Action",
          message: `${response.errorMessage}`,
          type: response.errorCode == 0 ? "success" : "error",
        });
        this.loadingService.hide();
        this.loadPendingUsers();
      },
      error: (error) => {
        this.notificationService.addNotification({
          title: "Error",
          message: "Failed to perform action on user",
          type: "error",
        });
        this.toastService.show({
          title: "Error",
          message: "Failed to perform action on user",
          type: "error",
        });
        this.loadingService.hide();
      },
    });
  }

  // rejectOrganization(org: Organization) {
  //   // const reason = prompt("Please provide a reason for rejection:");
  //   // if (reason) {

  //   this.loadingService.show("Rejecting organization...");
  //   this.organizationService.rejectOrganization(org.id).subscribe({
  //     next: (response) => {
  //       this.notificationService.addNotification({
  //         title: "Organization Action",
  //         message: `${org.name} has been rejected`,
  //         type: "success",
  //       });

  //       this.toastService.show({
  //         title: "Organization Action",
  //         message: `${response.errorMessage}`,
  //         type: response.errorCode == 0 ? "success" : "error",
  //       });

  //       this.loadingService.hide();
  //       this.loadPendingOrganizations();
  //     },
  //     error: (error) => {
  //       console.error("Error rejecting organization:", error);
  //       this.notificationService.addNotification({
  //         title: "Error",
  //         message: "Failed to reject organization",
  //         type: "error",
  //       });
  //       this.loadingService.hide();
  //     },
  //   });
  //   // }
  // }
}
