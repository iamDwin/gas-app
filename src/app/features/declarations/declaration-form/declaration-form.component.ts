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

@Component({
  selector: "app-declaration-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DrawerComponent,
    InstitutionDropdownComponent,
  ],
  template: `
    <app-drawer
      [isOpen]="true"
      [title]="declaration ? 'Edit Declaration' : 'New Declaration'"
      (close)="onCancel.emit()"
    >
      <div drawerContent>
        <form [formGroup]="form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Institution <span class="text-red-500">*</span>
            </label>
            <app-institution-dropdown
              [institutions]="institutions"
              [selectedInstitution]="selectedInstitution"
              (institutionSelected)="onInstitutionSelected($event)"
              placeholder="Select an institution"
            ></app-institution-dropdown>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Declared Quantity <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              formControlName="declaredQuantity"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Start Date <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              formControlName="startDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              End Date <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              formControlName="endDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
        </form>
      </div>

      <div drawerFooter>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            (click)="onCancel.emit()"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="!form.valid || !selectedInstitution"
            (click)="onSubmit()"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {{ declaration ? "Update" : "Create" }}
          </button>
        </div>
      </div>
    </app-drawer>
  `,
})
export class DeclarationFormComponent {
  @Input() declaration?: Declaration;
  @Output() save = new EventEmitter<CreateDeclarationRequest>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;
  selectedInstitution?: Organization;
  institutions: Organization[] = [];

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
    private notify: NotificationService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      declaredQuantity: ["", [Validators.required, Validators.min(0)]],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });

    this.getInstitutions();
  }

  getInstitutions = () => {
    this.institutionService.getOrganizations().subscribe({
      next: (orgs) => {
        this.institutions = orgs;
      },
      error: (error) => {
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
  }

  onInstitutionSelected(institution: Organization) {
    this.selectedInstitution = institution;
  }

  onSubmit() {
    if (this.form.valid && this.selectedInstitution) {
      const formValue = this.form.value;
      const user = JSON.parse(localStorage.getItem("auth_user") || "{}");

      this.save.emit({
        ...formValue,
        institutionCode: this.selectedInstitution.code,
        uploadedBy: user.email || "",
      });
    }
  }
}
