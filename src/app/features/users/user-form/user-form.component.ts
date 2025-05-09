import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { User } from "../user.model";
import { DrawerComponent } from "../../../shared/components/drawer/drawer.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";

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
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              formControlName="name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              formControlName="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select
              formControlName="role"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="admin">Admin</option>
              <option value="officer">Officer</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Organization ID</label
            >
            <input
              type="text"
              formControlName="organizationId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
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
  @Input() user?: User;
  @Output() save = new EventEmitter<Omit<User, "id" | "createdAt">>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      role: ["viewer", Validators.required],
      organizationId: ["", Validators.required],
    });
  }

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
