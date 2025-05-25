import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DrawerComponent } from "../../../shared/components/drawer/drawer.component";
import { AuthService, User } from "../../../core/auth/auth.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ToastService } from "../../../shared/services/toast.service";
import { OrganizationService } from "../../organizations/organization.service";

@Component({
  selector: "app-forms",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    DrawerComponent,
  ],
  templateUrl: "./forms.component.html",
})
export class FormsComponent implements OnInit {
  // CreateDeclarationRequest
  @Output() save = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;
  // selectedInstitution?: Organization;
  // institutions: Organization[] = [];
  nomination: any;
  currentUser: User | null = null;

  ngOnInit(): void {}

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
