import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { userList, UserResponse, UsersResponse } from "./user.model";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/auth/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.apiUrl;
  // user = this.authService.getCurrentUser();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();

    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  getUsers(): Observable<UserResponse[]> {
    let user = this.authService.getCurrentUser();
    let path = "";
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    if (user.type == "M")
      path = `/admin/user/api/v1/get_all_users/${user.name}`;
    else if (user.type == "G")
      path = `/admin/useradmin/api/v1/get_all_users/${user.name}`;
    else
      path = `/admin/user/api/v1/get_approved_auths_by_institution/${user.organizationId}/${user.name}`;

    return this.http
      .get<UsersResponse>(`${this.apiUrl}${path}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.users || []));
  }

  getUserRoles(): Observable<any[]> {
    let user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    return this.http.get<any>(
      `${this.apiUrl}/admin/role/api/v1/get_role_list/${user.name}`,
      { headers: this.getHeaders() }
    );
  }

  unlockUser(userData: any): Observable<any> {
    let user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    return this.http.post<any>(
      `${this.apiUrl}/admin/user/api/v1/unlock_user`,
      { ...userData },
      { headers: this.getHeaders() }
    );
  }

  activateDeativateUser(userData: any, action: string): Observable<any> {
    let user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    let path = action === "activate" ? `reactivate_user` : "deactivate_user";
    return this.http.post<any>(
      `${this.apiUrl}/admin/user/api/v1/${path}`,
      { ...userData },
      { headers: this.getHeaders() }
    );
  }

  addUser(userData: any): Observable<any> {
    let user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    let path = "";

    if (user.type == "G") {
      if (userData.for === "self")
        path = `/admin/useradmin/api/v1/init_create_user`;
      else path = `/admin/user/api/v1/init_create_user`;
    } else path = `/admin/user/api/v1/init_create_user`;

    return this.http.post<any>(
      `${this.apiUrl}${path}`,
      { ...userData, createdBy: user.name },
      { headers: this.getHeaders() }
    );
  }

  updateUser(userData: any): Observable<any> {
    let user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    return this.http.patch<UsersResponse>(
      `${this.apiUrl}/admin/user/api/v1/init_update_user`,
      { ...userData },
      { headers: this.getHeaders() }
    );
  }

  getPendingUsers(): Observable<any[]> {
    let user = this.authService.getCurrentUser();
    let path = "";
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    if (user.type == "M")
      path = `/admin/user/api/v1/get_pending_auths/${user.name}`;
    else if (user.type == "G")
      path = `/admin/useradmin/api/v1/get_pending_auths/${user.name}`;
    else
      path = `/admin/user/api/v1/get_pending_auths_by_institution/${user.organizationId}/${user.name}`;

    return this.http
      .get<any>(`${this.apiUrl}${path}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.users || []));
  }

  approveUser(id: string): Observable<any> {
    let user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    let request = {
      id: id,
      authorizedBy: user?.name,
      authorizedComment: null,
      authStatus: 1,
    };

    let path = "";
    if (user.type == "M") path = `/admin/user/api/v1/authorize_request`;
    else if (user.type == "G")
      path = `/admin/useradmin/api/v1/authorize_request`;
    else path = `/admin/user/api/v1/authorize_request`;

    return this.http.post<any>(
      `${this.apiUrl}${path}`,
      { ...request },
      { headers: this.getHeaders() }
    );
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
