import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map, tap } from "rxjs/operators";
import { ToastService } from "../../shared/services/toast.service";

export interface User {
  id: string;
  email: string;
  role: "admin" | "officer" | "viewer";
  organizationId: string | null;
  organizationName: string;
  institutionType: string;
  type: string;
  name: string;
  fullName: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "officer" | "viewer";
  organizationId: string;
  createdAt?: Date;
}

export interface AuthResponse {
  errorCode: string;
  errorMessage: string;
  id: number;
  userName: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName: string;
  institutionId: string;
  institutionName: string;
  createdBy: string;
  institutionType: string;
  lastLogin: string; // ISO date string
  passwordChangeDate: string; // ISO date string
  changePassword: boolean;
  createdAt: string; // ISO date string
  type: string;
  initiatorComment: string;
  locked: boolean;
  active: boolean;
  roleWeight: number;
  token: string;
  services: {
    id: number;
    name: string;
    weight: number;
    weightList: string;
  }[];
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = "auth_token";
  private userKey = "auth_user";
  private returnUrlKey = "auth_return_url";

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    // Check for existing token and user on startup
    const token = sessionStorage.getItem(this.tokenKey);
    const userStr = sessionStorage.getItem(this.userKey);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);

        // Get the return URL if it exists
        const returnUrl = sessionStorage.getItem(this.returnUrlKey);
        if (returnUrl) {
          // Clear the stored URL
          sessionStorage.removeItem(this.returnUrlKey);
          // Navigate to the stored URL
          this.router.navigateByUrl(returnUrl);
        }
      } catch (e) {
        // Invalid user data in sessionStorage
        this.logout();
      }
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/admin/user/api/v1/authenticate_user`,
        {
          username,
          password,
        }
      )
      .pipe(
        map((response) => {
          if (response.errorCode === "0" && response.token) {
            // Successful login
            const user: User = {
              id: response.id.toString(), // We'll need to get this from the backend
              email: response.email,
              role: this.mapRoleFromBackend(response.roleName),
              organizationId: response.institutionId, // We'll need to get this from the backend
              organizationName: response.institutionName, // We'll need to get this from the backend
              institutionType: response.institutionType, // We'll need to get this from the backend
              type: response.type, // We'll need to get this from the backend
              name: response.userName, // We'll need to get the actual name from the backend
              fullName: response.fullName, // We'll need to get the actual name from the backend
            };

            sessionStorage.setItem(this.tokenKey, response.token);
            sessionStorage.setItem(this.userKey, JSON.stringify(user));
            this.currentUserSubject.next(user);

            this.toastService.show({
              title: "Login Successful",
              message: `Welcome back!`,
              type: "success",
            });

            return response;
          } else {
            throw new Error(
              response.errorMessage || "Invalid username or password"
            );
          }
        }),
        catchError((error) => {
          console.error("Login error:", error);
          let errorMessage = error.message || "Invalid username or password";

          if (error.error?.errorMessage) {
            errorMessage = error.error.errorMessage;
          }

          this.toastService.show({
            title: "Login Failed",
            message:
              "There was an error trying sign you in, Please try again, is issue persist, contact support",
            type: "error",
          });

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  loginAsOrganization(
    username: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/admin/useradmin/api/v1/authenticate_user`,
        {
          username,
          password,
        }
      )
      .pipe(
        map((response) => {
          if (response.errorCode === "0" && response.token) {
            // Successful login
            const user: User = {
              id: response.id.toString(), // We'll need to get this from the backend
              email: response.email,
              role: this.mapRoleFromBackend(response.roleName),
              organizationId: response.institutionId, // We'll need to get this from the backend
              organizationName: response.institutionName, // We'll need to get this from the backend
              institutionType: response.institutionType, // We'll need to get this from the backend
              type: "G", // We'll need to get this from the backend
              name: response.userName, // We'll need to get the actual name from the backend
              fullName: response.fullName, // We'll need to get the actual name from the backend
            };

            sessionStorage.setItem(this.tokenKey, response.token);
            sessionStorage.setItem(this.userKey, JSON.stringify(user));
            this.currentUserSubject.next(user);

            this.toastService.show({
              title: "Login Successful",
              message: `Welcome back!`,
              type: "success",
            });

            return response;
          } else {
            throw new Error(
              response.errorMessage || "Invalid username or password"
            );
          }
        }),
        catchError((error) => {
          console.error("Login error:", error);
          let errorMessage = error.message || "Invalid username or password";

          if (error.error?.errorMessage) {
            errorMessage = error.error.errorMessage;
          }

          this.toastService.show({
            title: "Login Failed",
            message: errorMessage,
            type: "error",
          });

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  private mapRoleFromBackend(roleName: string | null): User["role"] {
    switch (roleName?.toLowerCase()) {
      case "admin":
        return "admin";
      case "organization admin":
        return "officer";
      case "organization user":
        return "viewer";
      default:
        return "viewer";
    }
  }

  forgotPassword(username: string): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}/admin/user/api/v1/forgot_password/${username}`,
        { username }
      )
      .pipe(
        tap(() => {
          this.toastService.show({
            title: "Password Reset Email Sent",
            message: "Please check your email for instructions",
            type: "success",
          });
        }),
        catchError((error) => {
          console.error("Forgot password error:", error);
          this.toastService.show({
            title: "Password Reset Failed",
            message: "Failed to process forgot password request",
            type: "error",
          });
          return throwError(
            () => new Error("Failed to process forgot password request")
          );
        })
      );
  }

  forgotPasswordAsOrganization(username: string): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}/admin/useradmin/api/v1/forgot_password/${username}`,
        { username }
      )
      .pipe(
        tap((response) => {
          this.toastService.show({
            title: "Password Reset Email Sent",
            message: "Please check your email for instructions",
            type: "success",
          });
        }),
        catchError((error) => {
          console.error("Forgot password error:", error);
          this.toastService.show({
            title: "Password Reset Failed",
            message: "Failed to process forgot password request",
            type: "error",
          });
          return throwError(
            () => new Error("Failed to process forgot password request")
          );
        })
      );
  }

  logout(): void {
    // Store the current URL before logging out
    sessionStorage.setItem(this.returnUrlKey, this.router.url);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
    this.toastService.show({
      title: "Signed Out",
      message: "You have been successfully signed out",
      type: "success",
    });
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
    const user = this.currentUserSubject.value;
    return !!user && !!token;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  isOrganizationUser(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === "officer" || user?.role === "viewer";
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === "admin";
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
}
