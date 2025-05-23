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

@Component({
  selector: "app-organization-form",
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
      [title]="organization ? 'Edit Organization' : 'Create Institution'"
      (close)="onCancel.emit()"
    >
      <div drawerContent>
        <form [formGroup]="form" class="space-y-4">
          <div>
            <label class="block text-sm font-light text-gray-700">
              Institution Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              formControlName="name"
              placeholder="Institution Name"
              class="mt-1 block w-full min-h-[44px] rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            />
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700">
              Institution Email <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              formControlName="email"
              placeholder="Institution Email"
              class="mt-1 block w-full min-h-[44px] rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            />
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700">
              Institution Address (optional)
            </label>
            <input
              type="text"
              formControlName="address"
              placeholder="Institution Address"
              class="mt-1 block w-full min-h-[44px] rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            />
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700">
              Institution Phone (optional)
            </label>
            <input
              type="tel"
              formControlName="phone"
              placeholder="Institution Phone Number"
              class="mt-1 block w-full min-h-[44px] rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            />
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700">
              Declaration Contractual Volume (DCV) - MMscf
              <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              [min]="0"
              formControlName="dcv"
              placeholder=" Declaration Contractual Volume"
              class="mt-1 block w-full min-h-[44px] rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            />
          </div>

          <div>
            <label class="block text-sm font-light text-gray-700">
              Institution Type <span class="text-red-500">*</span>
            </label>
            <select
              formControlName="type"
              class="mt-1 block w-full min-h-[44px] rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
              (change)="onTypeChange($event)"
            >
              <option value="D">Downstream</option>
              <option value="M">Midstream</option>
              <option value="U">Upstream</option>
            </select>
          </div>

          <div *ngIf="showMidstreamDropdown">
            <label class="block text-sm font-light text-gray-700">
              Select Midstream Company
            </label>
            <!-- [multiple]="true" -->
            <select
              formControlName="midstream"
              class="mt-1 block w-full min-h-[44px] rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            >
              <option
                *ngFor="let company of midStreamOrganisations"
                [value]="company.code"
              >
                {{ company.name }}
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
            {{ organization ? "Update" : "Create Institution" }}
          </app-button>
        </div>
      </div>
    </app-drawer>
  `,
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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      address: [""],
      phone: [""],
      dcv: [0, [Validators.required, Validators.min(0)]],
      type: ["M", Validators.required],
      midstream: [""],
    });
  }

  ngOnInit() {
    if (this.organization) {
      this.form.patchValue(this.organization);
    }

    this.currentUser = this.authService.getCurrentUser();

    if (this.organizations) {
      this.midStreamOrganisations = this.organizations
        .filter((org) => org.type === "M")
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
    } else {
      this.midStreamOrganisations = [];
    }

    // console.log(this.currentUser);
    // console.log(this.midStreamOrganisations);
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

  onTypeChange(event: Event) {
    const selectedType = (event.target as HTMLSelectElement).value;
    this.showMidstreamDropdown = selectedType === "U" || selectedType === "D";
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
