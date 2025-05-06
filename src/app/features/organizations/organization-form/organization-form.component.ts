import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Organization, CreateOrganizationRequest } from '../organization.model';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DrawerComponent],
  template: `
    <app-drawer
      [isOpen]="true"
      [title]="organization ? 'Edit Organization' : 'Add Organization'"
      (close)="onCancel.emit()"
    >
      <div drawerContent>
        <form [formGroup]="form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Name <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              formControlName="name"
              class="mt-1"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Email <span class="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              formControlName="email"
              class="mt-1"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input 
              type="text" 
              formControlName="address"
              class="mt-1"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input 
              type="tel" 
              formControlName="phone"
              class="mt-1"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              DCV <span class="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              formControlName="dcv"
              class="mt-1"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Type <span class="text-red-500">*</span>
            </label>
            <select 
              formControlName="type"
              class="mt-1"
            >
              <option value="Upstream">Upstream</option>
              <option value="Downstream">Downstream</option>
            </select>
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
            [disabled]="!form.valid"
            (click)="onSubmit()"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {{ organization ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </app-drawer>
  `
})
export class OrganizationFormComponent {
  @Input() organization?: Organization;
  @Output() save = new EventEmitter<CreateOrganizationRequest>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      phone: [''],
      dcv: [0, [Validators.required, Validators.min(0)]],
      type: ['Upstream', Validators.required]
    });
  }

  ngOnInit() {
    if (this.organization) {
      this.form.patchValue(this.organization);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}