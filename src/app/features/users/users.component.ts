import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { userList, User, UserResponse } from "./user.model";
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
import {
  ConfirmationModalComponent,
  ConfirmationModalConfig,
} from "../../shared/components/confirmation-modal/confirmation-modal.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    DataTableComponent,
    ButtonComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: "./user.component.html",
})
export class UsersComponent implements OnInit {
  users: UserResponse[] = [];
  isDrawerOpen = false;
  selectedUser?: userList;
  showLockModal = false;
  showActivateModal = false;
  isLoading = false;
  userToLock?: User;
  userToActivate?: User;
  loadingMessage = "Loading users...";
  actAction = "";

  lockModalConfig: ConfirmationModalConfig = {
    title: "Lock User",
    message: "Are you sure you want to lock this user ?",
    confirmText: "Lock User",
    cancelText: "Cancel",
    type: "danger",
  };
  unlockModalConfig: ConfirmationModalConfig = {
    title: "Unlock User",
    message: "Are you sure you want to unlock this user ?",
    confirmText: "Unlock User",
    cancelText: "Cancel",
    type: "warning",
  };
  activateModalConfig: ConfirmationModalConfig = {
    title: "Activate User",
    message: "Are you sure you want to activate this user ?",
    confirmText: "Activate User",
    cancelText: "Cancel",
    type: "warning",
  };
  deactivateModalConfig: ConfirmationModalConfig = {
    title: "Deactivate User",
    message: "Are you sure you want to deactivate this user ?",
    confirmText: "Deactivate User",
    cancelText: "Cancel",
    type: "danger",
  };

  lockModalMessage: ConfirmationModalConfig = this.lockModalConfig;
  activateModalMessage: ConfirmationModalConfig = this.activateModalConfig;
  columns = [
    { prop: "fullName", name: "Full Name" },
    { prop: "email", name: "Email" },
    { prop: "roleName", name: "Role" },
    { prop: "institutionName", name: "Institution" },
    { prop: "active", name: "status" },
    { prop: "locked", name: "Locked" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "Edit",
      type: "primary",
    },
    {
      label: "Deactivate",
      type: "warning",
    },
  ];

  constructor(
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([{ label: "Users", link: "/users" }]);
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (userList) => {
        this.users = userList;
        this.isLoading = false;
      },
      error: (error) => {
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

  // Method to determine actions based on user status
  getActionsForUser(user: any): TableAction[] {
    const actions: TableAction[] = [
      {
        label: "Edit",
        type: "primary",
      },
    ];

    if (user.active) {
      actions.push({
        label: "Deactivate",
        type: "warning",
      });
    } else {
      actions.push({
        label: "Activate",
        type: "success",
      });
    }

    if (user.locked) {
      actions.push({
        label: "Unlock",
        type: "warning",
      });
    } else {
      actions.push({
        label: "Lock",
        type: "danger",
      });
    }

    return actions;
  }

  onActionClick(event: { action: TableAction; row: userList }) {
    switch (event.action.label) {
      case "Edit":
        this.editUser(event.row);
        break;
      case "Deactivate":
        this.activateAction(event.row, "deactivate");
        break;
      case "Activate":
        this.activateAction(event.row, "activate");
        break;
      case "Lock":
        this.lockAction(event.row, "lock");
        break;
      case "Unlock":
        this.lockAction(event.row, "unlock");
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

  editUser(user: userList) {
    this.selectedUser = user;
    this.isDrawerOpen = true;
  }

  saveUser(userData: Omit<User, "id">) {
    this.isLoading = true;
    this.loadingMessage = this.selectedUser
      ? "Updating user..."
      : "Creating user...";

    if (this.selectedUser) {
      // Find the full user data from this.users using the id
      const fullUserData = this.users.find(
        (user: any) => user.id === this.selectedUser?.id
      );

      if (fullUserData) {
        // Update the full user data with the fields from userData
        const updatedUserData = {
          ...fullUserData,
          ...userData,
        };
        this.userService.updateUser(updatedUserData).subscribe({
          next: (response) => {
            this.notificationService.addNotification({
              title: "User Action",
              message: `${response.errorMessage}`,
              type: response.errorCode == "1" ? "error" : "success",
            });
            this.toastService.show({
              title: "User Action",
              message: `${response.errorMessage}`,
              type: response.errorCode == "1" ? "error" : "success",
            });
          },
          error: (error) => {
            this.notificationService.addNotification({
              title: "User Action",
              message: `${error.errorMessage}`,
              type: error.errorCode == "1" ? "error" : "success",
            });
            this.toastService.show({
              title: "User Action",
              message: `${error.errorMessage}`,
              type: error.errorCode == "1" ? "error" : "success",
            });
          },
        });
      } else {
        // Handle the case where the user is not found
        this.notificationService.addNotification({
          title: "User Action",
          message: "User not found.",
          type: "error",
        });
        this.toastService.show({
          title: "User Action",
          message: "User not found.",
          type: "error",
        });
      }
    } else {
      // console.log({ userData });
      this.userService.addUser(userData).subscribe({
        next: (response: any) => {
          this.notificationService.addNotification({
            title: "User Action",
            message: `${response.errorMessage}`,
            type: response.errorCode == "1" ? "error" : "success",
          });
          this.toastService.show({
            title: "User Action",
            message: `${response.errorMessage}`,
            type: response.errorCode == "1" ? "error" : "success",
          });
          if (response.errorCode == 0)
            this.router.navigateByUrl("/users/pending");
        },
        error: (error) => {
          this.toastService.show({
            title: "User Action",
            message: `${error.errorMessage}`,
            type: error.errorCode == "1" ? "error" : "success",
          });
        },
      });
    }

    this.isLoading = false;
    this.closeDrawer();
  }

  deleteUser(id: string) {
    // if (confirm("Are you sure you want to delete this user?")) {
    //   this.isLoading = true;
    //   this.loadingMessage = "Deleting user...";
    //   setTimeout(() => {
    //     // this.userService.deleteUser(id);
    //     this.notificationService.addNotification({
    //       title: "User Deleted",
    //       message: "The user has been deleted successfully",
    //       type: "success",
    //     });
    //     this.isLoading = false;
    //   }, 2000); // Simulate 2 second delete delay
    // }
  }

  lockAction = (userData: any, action: "lock" | "unlock") => {
    this.showLockModal = true;
    this.userToLock = userData;
    if (action === "lock") this.lockModalMessage = this.lockModalConfig;
    else this.lockModalMessage = this.unlockModalConfig;
  };

  activateAction = (userData: any, action: "activate" | "deactivate") => {
    this.showActivateModal = true;
    this.userToActivate = userData;
    this.actAction = action;
    if (action === "activate")
      this.activateModalMessage = this.activateModalConfig;
    else this.activateModalMessage = this.deactivateModalConfig;
  };

  cancelLock() {
    this.showLockModal = false;
    this.userToLock = undefined;
  }

  cancelActivate() {
    this.showActivateModal = false;
    this.userToActivate = undefined;
    this.actAction = "";
  }

  confirmLockUser = () => {
    this.isLoading = true;
    this.showLockModal = false;
    this.loadingMessage = "Performing Action...";

    this.userService.unlockUser(this.userToLock).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.addNotification({
          title: "User Request",
          message: `${response.errorMessage}`,
          type: response.errorCode == "1" ? "error" : "success",
        });
        this.toastService.show({
          title: "User Request",
          message: `${response.errorMessage}`,
          type: response.errorCode == "1" ? "error" : "success",
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.addNotification({
          title: "User Request",
          message: `${error.errorMessage}`,
          type: error.errorCode == "1" ? "error" : "success",
        });
        this.toastService.show({
          title: "User Request",
          message: `${error.errorMessage}`,
          type: error.errorCode == "1" ? "error" : "success",
        });
      },
    });
  };

  confirmActivateUser = () => {
    this.isLoading = true;
    this.showLockModal = false;
    this.loadingMessage = "Performing Action...";

    this.userService
      .activateDeativateUser(this.userToActivate, this.actAction)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificationService.addNotification({
            title: "User Request",
            message: `${response.errorMessage}`,
            type: response.errorCode == "1" ? "error" : "success",
          });
          this.toastService.show({
            title: "User Request",
            message: `${response.errorMessage}`,
            type: response.errorCode == "1" ? "error" : "success",
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.addNotification({
            title: "User Request",
            message: `${error.errorMessage}`,
            type: error.errorCode == "1" ? "error" : "success",
          });
          this.toastService.show({
            title: "User Request",
            message: `${error.errorMessage}`,
            type: error.errorCode == "1" ? "error" : "success",
          });
        },
      });
  };
}
