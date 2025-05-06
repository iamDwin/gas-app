import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex">
      <!-- Left side - Form -->
      <div
        class="w-full lg:w-1/3 flex items-center justify-center p-8  bg-[#FAFAFA]"
      >
        <div
          class="w-full max-w-sm  px-8 py-20 rounded-xl border border-[#E9EAEB] bg-[#FAFAFA] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
        >
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Reset password</h2>
            <p class="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email address</label
              >
              <input
                id="email"
                type="email"
                formControlName="email"
                class="mt-1 block w-full min-h-[44px] rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                [class.border-red-500]="
                  form.get('email')?.invalid && form.get('email')?.touched
                "
              />
            </div>

            <div>
              <button
                type="submit"
                [disabled]="!form.valid || isLoading"
                class="w-full flex justify-center items-center h-11 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {{ isLoading ? "Sending..." : "Send reset link" }}
              </button>
            </div>

            <div *ngIf="error" class="text-sm text-red-600 text-center">
              {{ error }}
            </div>
            <div *ngIf="success" class="text-sm text-green-600 text-center">
              {{ success }}
            </div>

            <div class="text-sm text-center">
              <a
                routerLink="/login"
                class="font-medium text-primary hover:text-primary/90"
              >
                Back to login
              </a>
            </div>
          </form>
        </div>
      </div>

      <!-- Right side - Background -->
      <div class="hidden lg:block relative flex-1">
        <div
          class="absolute inset-0 flex flex-col items-center justify-center p-8"
        >
          <div class="max-w-lg text-center text-white mb-8">
            <h1 class="text-5xl font-bold mb-6">Reset your password</h1>
            <p class="text-xl text-gray-300">
              We'll help you get back to your account securely.
            </p>
          </div>
          <div class="w-full h-full absolute inset-0 z-[-1]">
            <img
              src="assets/banner.jpeg"
              alt="Gas Pipeline"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-[#1a2234] opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  form: FormGroup;
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = null;
      this.success = null;

      const { email } = this.form.value;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.success = "Password reset link has been sent to your email";
          this.isLoading = false;
        },
        error: (err: any) => {
          this.error = "Failed to send reset link. Please try again.";
          this.isLoading = false;
        },
      });
    }
  }
}
