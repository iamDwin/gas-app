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
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex">
      <!-- Left side - Login form -->
      <div class="w-full lg:w-1/3 flex items-center justify-center bg-white">
        <div class="w-full max-w-sm px-8 py-20 rounded-xl bg-white">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">
              Sign in to your Account
            </h2>
          </div>

          <form
            [formGroup]="loginForm"
            (ngSubmit)="onSubmit()"
            class="space-y-6"
          >
            <div>
              <label
                for="username"
                class="block text-md font-base text-gray-700"
                >Username</label
              >
              <input
                id="username"
                type="text"
                formControlName="username"
                class="mt-1 block w-full min-h-[44px] rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                [class.border-red-500]="
                  loginForm.get('username')?.invalid &&
                  loginForm.get('username')?.touched
                "
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-md font-base text-gray-700"
                >Password</label
              >
              <div class="relative">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="mt-1 block w-full min-h-[44px] rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 border border-[#E9EAEB] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                  [class.border-red-500]="
                    loginForm.get('password')?.invalid &&
                    loginForm.get('password')?.touched
                  "
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      *ngIf="!showPassword"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      *ngIf="!showPassword"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      *ngIf="showPassword"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  for="remember-me"
                  class="ml-2 block text-sm text-gray-900"
                  >Remember me</label
                >
              </div>

              <div class="text-md">
                <a
                  routerLink="/forgot-password"
                  class="font-medium text-primary hover:text-primary/90"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                [disabled]="!loginForm.valid || isLoading"
                class="w-full flex justify-center items-center h-11 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {{ isLoading ? "Signing in..." : "Sign in" }}
              </button>
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
            <h1 class="text-5xl font-bold mb-6">Welcome</h1>
            <p class="text-xl text-gray-300">
              Sign in to access your account and manage your declarations.
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
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: (err) => {
          this.error = err.message || "Invalid username or password";
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
