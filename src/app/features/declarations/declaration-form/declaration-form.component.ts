import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Declaration } from '../declaration.model';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';

@Component({
  selector: 'app-declaration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DrawerComponent],
  template: `
    <app-drawer
      [isOpen]="true"
      [title]="declaration ? 'Edit Declaration' : 'New Declaration'"
      (close)="onCancel.emit()"
    >
      <div drawerContent>
        <form [formGroup]="form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              formControlName="title"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              formControlName="description"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select 
              formControlName="status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="draft">Draft</option>
              <option value="pending_org_approval">Pending Organization Approval</option>
              <option value="pending_admin_approval">Pending Admin Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
            {{ declaration ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </app-drawer>
  `
})
export class DeclarationFormComponent {
  @Input() declaration?: Declaration;
  @Output() save = new EventEmitter<Omit<Declaration, 'id' | 'createdAt' | 'updatedAt'>>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['draft', Validators.required]
    });
  }

  ngOnInit() {
    if (this.declaration) {
      this.form.patchValue(this.declaration);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}