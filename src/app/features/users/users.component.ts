import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { UserFormComponent } from "./user-form/user-form.component";
import {
  DataTableComponent,
  TableAction,
} from "../../shared/components/data-table/data-table.component";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { NotificationService } from "../../shared/services/notification.service";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { ToastService } from "../../shared/services/toast.service";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    DataTableComponent,
    ButtonComponent,
  ],
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
        <div tableActions>
          <app-button variant="semiFilled" (click)="openDrawer()">
            Add User
            <svg
              width="18"
              class="ml-1"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 9.16667L10 11.6667L18.3333 3.33333M13.3333 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V10"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </app-button>
        </div>
      </app-data-table>

      <!-- Drawer -->
      <div
        class="drawer"
        [class.drawer-open]="isDrawerOpen"
        [class.drawer-closed]="!isDrawerOpen"
      >
        <app-user-form
          *ngIf="isDrawerOpen"
          [user]="selectedUser"
          (onCancel)="closeDrawer()"
        ></app-user-form>
      </div>
      <!-- (save)="saveUser($event)" -->

      <!-- Backdrop -->
      <div
        *ngIf="isDrawerOpen"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
        (click)="closeDrawer()"
      ></div>
    </div>
  `,
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isDrawerOpen = false;
  selectedUser?: User;
  isLoading = false;
  loadingMessage = "Loading users...";

  columns = [
    { prop: "name", name: "Name" },
    { prop: "email", name: "Email" },
    { prop: "role", name: "Role" },
    { prop: "organizationId", name: "Organization ID" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "View Details",
      type: "primary",
    },
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
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([{ label: "Users", link: "/users" }]);

    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.log({ error });
        this.notificationService.addNotification({
          title: "Error",
          message: "Failed To Get Users, Please Try Again",
          type: "error",
        });
        this.toastService.show({
          title: "Error",
          message: "Failed To Get Users, Please Try Again",
          type: "error",
        });
        this.isLoading = false;
      },
    });
  }

  onActionClick(event: { action: TableAction; row: User }) {
    switch (event.action.label) {
      case "View Details":
        // Handle view details
        break;
      case "Edit":
        this.editUser(event.row);
        break;
      case "Delete":
        this.deleteUser(event.row.id.toString());
        break;
    }
  }

  openDrawer() {
    this.selectedUser = undefined;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedUser = undefined;
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.isDrawerOpen = true;
  }

  saveUser(userData: Omit<User, "id">) {
    this.isLoading = true;
    this.loadingMessage = this.selectedUser
      ? "Updating user..."
      : "Creating user...";

    // setTimeout(() => {
    //   if (this.selectedUser) {
    //     this.userService.updateUser({
    //       ...userData,
    //       id: this.selectedUser.id,
    //     });
    //     this.notificationService.addNotification({
    //       title: "User Updated",
    //       message: `${userData.name} has been updated successfully`,
    //       type: "success",
    //     });
    //   } else {
    //     this.userService.addUser(userData);
    //     this.notificationService.addNotification({
    //       title: "User Created",
    //       message: `${userData.name} has been created successfully`,
    //       type: "success",
    //     });
    //   }

    //   this.isLoading = false;
    //   this.closeDrawer();
    // }, 2000);
  }

  deleteUser(id: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.isLoading = true;
      this.loadingMessage = "Deleting user...";

      setTimeout(() => {
        // this.userService.deleteUser(id);
        this.notificationService.addNotification({
          title: "User Deleted",
          message: "The user has been deleted successfully",
          type: "success",
        });
        this.isLoading = false;
      }, 2000); // Simulate 2 second delete delay
    }
  }
}
