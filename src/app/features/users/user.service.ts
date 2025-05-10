import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { User, UsersResponse } from "./user.model";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/auth/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.apiUrl;
  user = this.authService.getCurrentUser();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();

    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  // private users = new BehaviorSubject<User[]>([
  //   {
  //     id: "1",
  //     name: "John Doe",
  //     email: "john@example.com",
  //     role: "admin",
  //     organizationId: "1",
  //   },
  //   {
  //     id: "2",
  //     name: "Jane Smith",
  //     email: "jane@example.com",
  //     role: "officer",
  //     organizationId: "1",
  //   },
  //   {
  //     id: "3",
  //     name: "Bob Wilson",
  //     email: "bob@example.com",
  //     role: "viewer",
  //     organizationId: "2",
  //   },
  //   {
  //     id: "4",
  //     name: "Alice Johnson",
  //     email: "alice@example.com",
  //     role: "officer",
  //     organizationId: "2",
  //   },
  //   {
  //     id: "5",
  //     name: "Charlie Brown",
  //     email: "charlie@example.com",
  //     role: "viewer",
  //     organizationId: "3",
  //   },
  // ]);

  getUsers(): Observable<User[]> {
    if (!this.user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    return this.http
      .get<UsersResponse>(
        `${this.apiUrl}/admin/user/api/v1/get_all_users/${this.user.name}`,
        { headers: this.getHeaders() }
      )
      .pipe(map((response) => response.institutionList || []));
  }

  getPendingUsers(): Observable<User[]> {
    if (!this.user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    return this.http
      .get<UsersResponse>(
        `${this.apiUrl}/admin/user/api/v1/get_pending_auths/${this.user.name}`,
        { headers: this.getHeaders() }
      )
      .pipe(map((response) => response.institutionList || []));
  }

  // addUser(user: Omit<User, "id">): void {
  //   const newUser: User = {
  //     ...user,
  //     id: Math.random().toString(36).substr(2, 9),
  //   };
  //   this.users.next([...this.users.value, newUser]);
  // }

  // updateUser(user: User): void {
  //   const updated = this.users.value.map((u) => (u.id === user.id ? user : u));
  //   this.users.next(updated);
  // }

  // deleteUser(id: string): void {
  //   const filtered = this.users.value.filter((u) => u.id !== id);
  //   this.users.next(filtered);
  // }
}
