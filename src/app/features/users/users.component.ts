import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserFormComponent } from './user-form/user-form.component';
import { DataTableComponent, TableAction } from '../../shared/components/data-table/data-table.component';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserFormComponent, DataTableComponent, ButtonComponent],
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
          <app-button 
            variant="filled"
            (click)="openDrawer()"
            [iconLeft]="'<svg class=&quot;w-5 h-5&quot; fill=&quot;none&quot; viewBox=&quot;0 0 24 24&quot; stroke=&quot;currentColor&quot;><path stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; stroke-width=&quot;2&quot; d=&quot;M12 6v6m0 0v6m0-6h6m-6 0H6&quot;/></svg>'"
          >
            Add User
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
          (save)="saveUser($event)"
          (onCancel)="closeDrawer()"
        ></app-user-form>
      </div>

      <!-- Backdrop -->
      <div 
        *ngIf="isDrawerOpen"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
        (click)="closeDrawer()"
      ></div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isDrawerOpen = false;
  selectedUser?: User;
  isLoading = false;
  loadingMessage = 'Loading users...';

  columns = [
    { prop: 'name', name: 'Name' },
    { prop: 'email', name: 'Email' },
    { prop: 'role', name: 'Role' },
    { prop: 'organizationId', name: 'Organization ID' },
    { prop: 'actions', name: 'Actions', sortable: false }
  ];

  actions: TableAction[] = [
    { 
      label: 'View Details',
      type: 'primary'
    },
    { 
      label: 'Edit',
      type: 'primary'
    },
    { 
      label: 'Delete',
      type: 'danger'
    }
  ];

  constructor(
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Users', link: '/users' }
    ]);

    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    setTimeout(() => {
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.isLoading = false;
      });
    }, 3000); // Simulate 3 second loading delay
  }

  onActionClick(event: {action: TableAction, row: User}) {
    switch (event.action.label) {
      case 'View Details':
        // Handle view details
        break;
      case 'Edit':
        this.editUser(event.row);
        break;
      case 'Delete':
        this.deleteUser(event.row.id);
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

  saveUser(userData: Omit<User, 'id'>) {
    this.isLoading = true;
    this.loadingMessage = this.selectedUser ? 'Updating user...' : 'Creating user...';
    
    setTimeout(() => {
      if (this.selectedUser) {
        this.userService.updateUser({
          ...userData,
          id: this.selectedUser.id
        });
        this.notificationService.addNotification({
          title: 'User Updated',
          message: `${userData.name} has been updated successfully`,
          type: 'success'
        });
      } else {
        this.userService.addUser(userData);
        this.notificationService.addNotification({
          title: 'User Created',
          message: `${userData.name} has been created successfully`,
          type: 'success'
        });
      }
      
      this.isLoading = false;
      this.closeDrawer();
    }, 2000); // Simulate 2 second save delay
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.loadingMessage = 'Deleting user...';
      
      setTimeout(() => {
        this.userService.deleteUser(id);
        this.notificationService.addNotification({
          title: 'User Deleted',
          message: 'The user has been deleted successfully',
          type: 'success'
        });
        this.isLoading = false;
      }, 2000); // Simulate 2 second delete delay
    }
  }
}