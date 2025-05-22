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
      <div class="w-full lg:w-1/3 flex items-center justify-center bg-white">
        <div class="w-full max-w-sm px-8 py-20 rounded-xl bg-white">
          <div class="mb-8">
            <h2
              class="flex gap-1 align-center text-xl font-bold text-primary mb-3"
            >
              <img
                src="https://ui-avatars.com/api/?name=Rig+Suite&background=117F63&color=ffffff&rounded=true&format=svg&size=30"
              />
              RigSuite
            </h2>
            <h2 class="text-2xl font-bold text-gray-900">
              Reset your password
            </h2>
          </div>

          <!-- Login Tabs -->
          <div class="mb-6">
            <div class="flex rounded-lg bg-gray-100 p-1 relative">
              <!-- Sliding background -->
              <div
                class="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md bg-primary transition-transform duration-300 ease-out"
                [style.transform]="
                  'translateX(' + (activeTab === 'admin' ? '0' : '100%') + ')'
                "
              ></div>

              <!-- Tab buttons -->
              <button
                (click)="switchTab('admin')"
                class="flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 relative z-10"
                [class.text-white]="activeTab === 'admin'"
                [class.text-gray-600]="activeTab !== 'admin'"
              >
                Administrators
              </button>
              <button
                (click)="switchTab('institution')"
                class="flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 relative z-10"
                [class.text-white]="activeTab === 'institution'"
                [class.text-gray-600]="activeTab !== 'institution'"
              >
                Institutions
              </button>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-700"
                >Username</label
              >
              <input
                id="username"
                type="text"
                formControlName="username"
                class="mt-1 block w-full min-h-[44px] rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                [class.border-red-500]="
                  form.get('username')?.invalid && form.get('username')?.touched
                "
              />
            </div>

            <div>
              <button
                type="submit"
                [disabled]="!form.valid || isLoading"
                class="w-full flex justify-center items-center h-11 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {{ isLoading ? "Resetting..." : "Reset Password" }}
              </button>
            </div>

            <div *ngIf="error" class="text-sm text-red-600 text-center">
              {{ error }}
            </div>
            <div *ngIf="success" class="text-sm text-green-600 text-center">
              {{ success }}
            </div>

            <div class="text-center">
              <a
                routerLink="/login"
                class="font-medium text-primary hover:text-primary/90"
              >
                Back to Sign In
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
            <p class="text-lg text-gray-300">
              We'll help you get back to your account securely.
            </p>
          </div>
          <div class="w-full h-full absolute inset-0 z-[-1]">
            <img
              src="assets/banner.jpeg"
              alt="Gas Pipeline"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-[#1a2234] opacity-30"></div>
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
  activeTab: "admin" | "institution" = "admin";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ["", Validators.required],
    });
  }

  switchTab(tab: "admin" | "institution") {
    this.activeTab = tab;
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = null;
      this.success = null;

      const { username } = this.form.value;

      const forgotPasswordMethod =
        this.activeTab === "admin"
          ? this.authService.forgotPasswordAsOrganization(username)
          : this.authService.forgotPassword(username);

      forgotPasswordMethod.subscribe({
        next: (response) => {
          console.log({ response });
          // this.success = "Password reset link has been sent";
          this.isLoading = false;
        },
        error: (err: any) => {
          // this.error = "Failed to send reset link. Please try again.";
          this.isLoading = false;
        },
      });
    }
  }
}
