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
import { AuthService } from "../../../core/auth/auth.service";
import {
  DropdownOption,
  SearchableDropdownComponent,
} from "../../../shared/components/searchable-dropdown/searchable-dropdown.component";
export interface UserRole {
  createdBy: string;
  id: number;
  institutionId: string;
  level: number;
  name: string;
  weight: number;
}

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DrawerComponent,
    ButtonComponent,
    InstitutionDropdownComponent,
    SearchableDropdownComponent,
  ],
  templateUrl: "./user-form.component.html",
})
export class UserFormComponent {
  @Input() user?: userList;
  @Output() save = new EventEmitter<Omit<User, "id" | "createdAt">>();
  @Output() onCancel = new EventEmitter<void>();
  organizations: Organization[] = [];
  selectedInstitution?: Organization;
  userRoles: DropdownOption[] = [];
  currentUser: any;
  selectedRole: DropdownOption | null = null;
  form: FormGroup;
  activeTab: "self" | "institution" = "institution";
  isAdmin = false;
  // institutions: any;
  constructor(
    private fb: FormBuilder,
    private organService: OrganizationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      fullName: ["", Validators.required],
      userName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      roleId: ["", Validators.required],
      type: ["", Validators.required],
      institutionId: ["", Validators.required],
    });

    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser.type !== "G") {
      this.form.patchValue({
        institutionId: this.currentUser?.organizationId,
        type: this.currentUser?.type,
      });
    }
    this.loadOrganizations();
    this.getUserRole();
  }

  ngOnInit() {
    if (this.user) {
      this.form.patchValue(this.user);
    }
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

  switchTab(tab: "self" | "institution") {
    this.activeTab = tab;

    if (tab == "self") {
      this.form.patchValue({
        institutionId: "0",
        type: this.currentUser?.type,
      });
    } else {
      this.form.patchValue({
        institutionId: "",
        type: "",
      });
      this.selectedInstitution = undefined;
    }
  }

  isGasCompanyAdmin(): boolean {
    return this.currentUser?.type === "G" && this.currentUser?.role === "admin";
  }

  onInstitutionSelected(institution: Organization) {
    this.selectedInstitution = institution;
    this.form.patchValue({
      institutionId: institution.code,
      type: institution.type,
    });
  }

  getUserRole = () => {
    this.userService.getUserRoles().subscribe({
      next: (response: any) => {
        this.userRoles = response.responses.map((role: UserRole) => ({
          value: role.id,
          label: role.name,
        })) as DropdownOption[];
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

  onRoleSelected(selectedOption: DropdownOption) {
    this.selectedRole = selectedOption;
    this.form.patchValue({ roleId: selectedOption.value });
  }

  onSubmit() {
    if (this.form.valid) {
      let payload = {
        ...this.form.value,
        for: this.activeTab,
      };
      this.save.emit(payload);
    }
  }
}
