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
import { InstitutionDropdownComponent } from "../../../shared/components/institution-dropdown/institution-dropdown.component";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DrawerComponent,
    ButtonComponent,
    // InstitutionDropdownComponent,
  ],
  template: `
    <app-drawer
      [isOpen]="true"
      [title]="user ? 'Edit User' : 'Create User'"
      (close)="onCancel.emit()"
    >
      <div drawerContent>
        <form [formGroup]="form" class="space-y-4">
          <div>
            <label class="block text-sm font-light text-gray-700"
              >Full Name</label
            >
            <input
              type="text"
              formControlName="fullName"
              placeholder="Full Name"
              class="mt-1 block w-full min-h-[44px] text-red rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            />
          </div>
          <div>
            <label class="block text-sm font-light text-gray-700"
              >User Name</label
            >
            <input
              type="text"
              formControlName="userName"
              placeholder="username"
              class="mt-1 block w-full min-h-[44px] text-red rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            />
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700">Email</label>
            <input
              type="email"
              formControlName="email"
              placeholder="email address"
              class="mt-1 block w-full min-h-[44px] text-red rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            />
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700"
              >User Type</label
            >
            <select
              formControlName="type"
              class="mt-1 block w-full min-h-[44px] text-red rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            >
              <option value="U">Upstream</option>
              <option value="M">Midstream</option>
              <option value="D">Downstream</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700">Role</label>
            <select
              formControlName="roleId"
              placeholder="role ID"
              class="mt-1 block w-full min-h-[44px] text-red rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            >
              <option *ngFor="let role of userRoles" [value]="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700"
              >Institutions</label
            >
            <select
              formControlName="institutionId"
              class="mt-1 block w-full min-h-[44px] text-red rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            >
              <option
                *ngFor="let institute of organizations"
                [value]="institute.code"
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
            <svg
              width="18"
              class="ml-2"
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
      </div>
    </app-drawer>
  `,
})
export class UserFormComponent {
  @Input() user?: userList;
  @Output() save = new EventEmitter<Omit<User, "id" | "createdAt">>();
  @Output() onCancel = new EventEmitter<void>();
  organizations: Organization[] = [];
  selectedInstitution?: Organization;
  userRoles: any;

  form: FormGroup;
  // institutions: any;
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

  onInstitutionSelected(institution: Organization) {
    this.selectedInstitution = institution;
    this.form.patchValue({ institutionId: institution.id });
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
