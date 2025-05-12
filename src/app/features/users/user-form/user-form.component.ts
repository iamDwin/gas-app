import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { User, userList } from "../user.model";
import { DrawerComponent } from "../../../shared/components/drawer/drawer.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { OrganizationService } from "../../organizations/organization.service";
import { Organization } from "../../organizations/organization.model";
import { NotificationService } from "../../../shared/services/notification.service";
import { ToastService } from "../../../shared/services/toast.service";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DrawerComponent,
    ButtonComponent,
  ],
  template: `
    <app-drawer
      [isOpen]="true"
      [title]="user ? 'Edit User' : 'Add User'"
      (close)="onCancel.emit()"
    >
      <div drawerContent>
        <form [formGroup]="form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Full Name</label
            >
            <input
              type="text"
              formControlName="fullName"
              class="mt-1 block w-full rounded-xl  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >User Name</label
            >
            <input
              type="text"
              formControlName="userName"
              class="mt-1 block w-full rounded-xl  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              formControlName="email"
              class="mt-1 block w-full rounded-xl  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >User Type</label
            >
            <select
              formControlName="type"
              class="mt-1 block w-full rounded-xl  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="M">MIDSTREAM</option>
              <option value="U">UPSTREAM</option>
              <option value="D">DOWNSTREAM</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select
              formControlName="roleId"
              class="mt-1 block w-full rounded-xl  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option *ngFor="let role of userRoles" [value]="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Institutions</label
            >
            <select
              formControlName="institutionId"
              class="mt-1 block w-full rounded-xl  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option
                *ngFor="let institute of organizations"
                [value]="institute.id"
              >
                {{ institute.name }}
              </option>
            </select>
          </div>
        </form>
      </div>

      <div drawerFooter>
        <div class="flex justify-end space-x-3">
          <app-button variant="default" (click)="onCancel.emit()">
            Cancel
          </app-button>
          <app-button
            variant="filled"
            [disabled]="!form.valid"
            (click)="onSubmit()"
          >
            {{ user ? "Update User" : "Create User" }}
          </app-button>
        </div>
      </div>
    </app-drawer>
  `,
})
export class UserFormComponent {
  @Input() user?: userList;
  @Output() save = new EventEmitter<Omit<User, "id" | "createdAt">>();
  @Output() onCancel = new EventEmitter<void>();
  organizations: Organization[] = [];
  userRoles: any;

  form: FormGroup;
  institutions: any;
  constructor(
    private fb: FormBuilder,
    private organService: OrganizationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      fullName: ["", Validators.required],
      userName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      roleId: ["", Validators.required],
      type: ["", Validators.required],
      institutionId: ["", Validators.required],
    });

    this.loadOrganizations();
    this.getUserRole();
  }

  loadOrganizations() {
    // this.isLoading = true;
    this.organService.getOrganizations().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        // this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.addNotification({
          title: "Organization Request",
          message: "Failed To Get Institutions, Please Try Again",
          type: "error",
        });
        this.toastService.show({
          title: "Organization Request",
          message: "Failed To Get Institutions, Please Try Again",
          type: "error",
        });
        // this.isLoading = false;
      },
    });
  }

  getUserRole = () => {
    this.userService.getUserRoles().subscribe({
      next: (response: any) => {
        this.userRoles = response.responses;
      },
      error: (error: any) => {
        this.notificationService.addNotification({
          title: "User Role Request",
          message: "Failed To Get User Roles, Please Try Again",
          type: "error",
        });
        this.toastService.show({
          title: "User Role Request",
          message: "Failed To Get User Roles, Please Try Again",
          type: "error",
        });
      },
    });
  };

  ngOnInit() {
    if (this.user) {
      this.form.patchValue(this.user);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
