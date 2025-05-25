import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import { Nomination } from "../nominations.model";

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
  @Output() save = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();
  @Input() nomination?: Nomination;
  form: FormGroup;
  currentUser: User | null = null;

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
      confirmedQuantity: [0, [Validators.required, Validators.min(0)]],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      institutionCode: [""],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      confirmedQuantity: this.nomination?.declaredQuantity,
      startDate: this.nomination?.periodStartDate,
      endDate: this.nomination?.periodEndDate,
      institutionCode: this.currentUser?.organizationId,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const user = JSON.parse(sessionStorage.getItem("auth_user") || "{}");
      // Ensure declaredQuantity has two decimal places
      if (formValue.confirmedQuantity !== undefined) {
        formValue.confirmedQuantity = parseFloat(
          formValue.confirmedQuantity
        ).toFixed(2);
      }
      this.save.emit({
        ...formValue,
        id: this.nomination?.id,
        by: user.name,
        comment: "nominate",
      });
    }
  }
}
