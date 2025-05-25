import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Declaration, CreateDeclarationRequest } from "../declaration.model";
import { DrawerComponent } from "../../../shared/components/drawer/drawer.component";
import {
  InstitutionDropdownComponent,
  Institution,
} from "../../../shared/components/institution-dropdown/institution-dropdown.component";
import { Organization } from "../../organizations/organization.model";
import { OrganizationService } from "../../organizations/organization.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ToastService } from "../../../shared/services/toast.service";
import { AuthService, User } from "../../../core/auth/auth.service";
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: "app-declaration-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DrawerComponent,
    InstitutionDropdownComponent,
    ButtonComponent,
  ],
  templateUrl: "./declaration-form.component.html",
})
export class DeclarationFormComponent {
  @Input() declaration?: Declaration;
  @Output() save = new EventEmitter<CreateDeclarationRequest>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;
  selectedInstitution?: Organization;
  institutions: Organization[] = [];
  institution: any;
  currentUser: User | null = null;

  // Mock institutions data - replace with actual data from your service
  // institutions: Organization[] = [
  //   { id: "1", name: "Acme Corporation", code: "ACME001" },
  //   { id: "2", name: "Global Industries", code: "GLOB002" },
  //   { id: "3", name: "Tech Solutions", code: "TECH003" },
  //   { id: "4", name: "Energy Systems", code: "ENRG004" },
  //   { id: "5", name: "Manufacturing Co", code: "MANF005" },
  // ];

  constructor(
    private fb: FormBuilder,
    private institutionService: OrganizationService,
    private orgService: OrganizationService,
    private notify: NotificationService,
    private toast: ToastService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();

    this.form = this.fb.group({
      declaredQuantity: [0, [Validators.required, Validators.min(0)]],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      institutionCode: [""],
    });
  }

  ngOnInit() {
    if (this.declaration) {
      // Find the institution from the list
      this.selectedInstitution = this.institutions?.find(
        (inst) => inst.code === this.declaration?.institutionCode
      );
      this.form.patchValue({
        declaredQuantity: this.declaration.declaredQuantity,
        startDate: this.declaration.startDate,
        endDate: this.declaration.endDate,
      });
    }

    this.setDCVvalue();
  }

  setDCVvalue = () => {
    let userType = this.currentUser?.type;
    if (userType === "M") this.getInstitutions();

    if (userType === "U") {
      this.form.patchValue({
        institutionCode: this.currentUser?.organizationId,
      });
      this.getUserInstitution();
    }
  };

  getInstitutions = () => {
    this.institutionService.getOrganizations().subscribe({
      next: (orgs) => {
        console.log({ orgs });
        this.institutions = orgs;

        this.institutions = this.institutions
          .filter((org) => org.type === "D")
          .sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (error) => {
        console.log(error);
        this.notify.addNotification({
          title: "Organization Request",
          message: "Failed To Get Institutions, Please Try Again",
          type: "error",
        });
        this.toast.show({
          title: "Organization Request",
          message: "Failed To Get Institutions, Please Try Again",
          type: "error",
        });
      },
    });
  };

  getUserInstitution() {
    this.orgService.getInstitution().subscribe({
      next: (orgs) => {
        this.institution = orgs;
        this.form.patchValue({
          declaredQuantity: this.institution.dcv,
        });
      },
      error: (error) => {
        // console.log(error);
        this.toast.show({
          title: "Organization Request",
          message: "Failed To Get User's Institutions data",
          type: "error",
        });
      },
    });
  }

  isMidStreamAdmin(): boolean {
    return this.currentUser?.type === "M" && this.currentUser?.role === "admin";
  }

  isGasCompanyAdmin(): boolean {
    return this.currentUser?.type === "G" && this.currentUser?.role === "admin";
  }

  onInstitutionSelected(institution: Organization) {
    this.selectedInstitution = institution;
    this.form.patchValue({
      declaredQuantity: this.selectedInstitution.dcv,
      institutionCode: this.selectedInstitution.code,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const user = JSON.parse(sessionStorage.getItem("auth_user") || "{}");
      // Ensure declaredQuantity has two decimal places
      if (formValue.declaredQuantity !== undefined) {
        formValue.declaredQuantity = parseFloat(
          formValue.declaredQuantity
        ).toFixed(2);
      }
      this.save.emit({
        ...formValue,
        uploadedBy: user.name,
      });
    }
  }
}
