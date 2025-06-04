import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Organization, CreateOrganizationRequest } from "../organization.model";
import { DrawerComponent } from "../../../shared/components/drawer/drawer.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService, User } from "../../../core/auth/auth.service";
import {
  DropdownOption,
  SearchableDropdownComponent,
} from "../../../shared/components/searchable-dropdown/searchable-dropdown.component";
import { InstitutionDropdownComponent } from "../../../shared/components/institution-dropdown/institution-dropdown.component";

@Component({
  selector: "app-organization-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DrawerComponent,
    ButtonComponent,
    SearchableDropdownComponent,
    InstitutionDropdownComponent,
  ],
  templateUrl: "./organization-form.component.html",
})
export class OrganizationFormComponent {
  @Input() organization?: Organization;
  @Input() organizations?: Organization[];
  @Output() save = new EventEmitter<CreateOrganizationRequest>();
  @Output() onCancel = new EventEmitter<void>();
  currentUser: User | null = null;
  midStreamOrganisations: Organization[] = [];
  form: FormGroup;
  showMidstreamDropdown = false;
  selectedInstitution?: Organization;
  institutionTypes = [
    {
      value: "U",
      label: "Upstream",
    },
    {
      value: "M",
      label: "Midstream",
    },
    {
      value: "D",
      label: "Downstream",
    },
  ];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      address: [""],
      phone: [""],
      dcv: [0, [Validators.required, Validators.min(0)]],
      type: ["", Validators.required],
      midstream: [""],
    });
  }

  ngOnInit() {
    if (this.organization) {
      this.form.patchValue(this.organization);
    }

    this.updateShowMidstreamDropdown(this.form.value.type);
    this.currentUser = this.authService.getCurrentUser();

    if (this.organizations) {
      this.midStreamOrganisations = this.organizations
        .filter((org) => org.type === "M")
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
    } else {
      this.midStreamOrganisations = [];
    }
  }

  private updateShowMidstreamDropdown(type: string | null) {
    this.showMidstreamDropdown = type === "U" || type === "D";
    if (type === "M") {
      this.form.patchValue({
        dcv: 0,
      });
    }
  }

  isUserAdmin(): boolean {
    return this.currentUser?.role === "admin";
  }

  isGasCompanyAdmin(): boolean {
    return this.currentUser?.type === "G" && this.currentUser?.role === "admin";
  }

  isGasCompanyOfficer(): boolean {
    return (
      this.currentUser?.type === "G" &&
      (this.currentUser?.role === "officer" ||
        this.currentUser?.role === "viewer")
    );
  }

  onTypeChange(selectedOption: DropdownOption | null) {
    this.updateShowMidstreamDropdown(selectedOption?.value);
  }

  onInstitutionSelected(institution: Organization) {
    this.selectedInstitution = institution;
    this.form.patchValue({
      midstream: institution.code,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
