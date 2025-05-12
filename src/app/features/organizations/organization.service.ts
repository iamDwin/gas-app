import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, map } from "rxjs";
import {
  Organization,
  CreateOrganizationRequest,
  OrganizationsResponse,
  PendingOrganizationsResponse,
} from "./organization.model";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class OrganizationService {
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

  getOrganizations(): Observable<Organization[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    return this.http
      .get<OrganizationsResponse>(
        `${this.apiUrl}/admin/institution/api/v1/get_all_institutions/${user.name}`,
        { headers: this.getHeaders() }
      )
      .pipe(map((response) => response.institutionList || []));
  }

  getPendingOrganizations(): Observable<Organization[]> {
    if (!this.user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    return this.http
      .get<any>(
        `${this.apiUrl}/admin/institution/api/v1/get_pending_auths/${this.user.name}`,
        { headers: this.getHeaders() }
      )
      .pipe(
        map((response) => {
          return Array.isArray(response) ? response : [];
        })
      );
  }

  addOrganization(
    organization: CreateOrganizationRequest
  ): Observable<Organization> {
    const user = this.authService.getCurrentUser();
    const payload = {
      ...organization,
      type: organization.type === "Upstream" ? "U" : "D",
      createdBy: user?.name || "",
    };

    return this.http.post<Organization>(
      `${this.apiUrl}/admin/institution/api/v1/init_create_institution`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  updateOrganization(organization: Organization): Observable<Organization> {
    const payload = {
      ...organization,
      type: organization.type === "Upstream" ? "U" : "D",
    };

    return this.http.patch<Organization>(
      `${this.apiUrl}/admin/institution/api/v1/init_update_institution`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  approveOrganization(id: string): Observable<any> {
    let request = {
      id: id,
      authorizedBy: this.user?.name,
      authorizedComment: null,
      authStatus: 1,
    };
    return this.http.post<any>(
      `${this.apiUrl}/admin/institution/api/v1/authorize_request`,
      { ...request },
      { headers: this.getHeaders() }
    );
  }

  rejectOrganization(id: string, reason?: string): Observable<any> {
    let request = {
      id: id, //id of request
      authorizedBy: this.user?.name,
      authorizedComment: null,
      authStatus: 0,
    };
    return this.http.post<any>(
      `${this.apiUrl}/admin/institution/api/v1/authorize_request`,
      { ...request },
      { headers: this.getHeaders() }
    );
  }

  deleteOrganization(row: any): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/admin/institution/api/v1/init_delete_institution`,
      { headers: this.getHeaders(), body: row }
    );
  }
}
