import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Organization, CreateOrganizationRequest, OrganizationsResponse, PendingOrganizationsResponse } from './organization.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getOrganizations(): Observable<Organization[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable(subscriber => subscriber.next([]));
    }

    return this.http.get<OrganizationsResponse>(
      `${this.apiUrl}/admin/institution/api/v1/get_all_institutions/${user.id}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.institutionList || [])
    );
  }

  getPendingOrganizations(): Observable<Organization[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable(subscriber => subscriber.next([]));
    }

    return this.http.get<any>(
      `${this.apiUrl}/admin/institution/api/v1/get_pending_auths/${user.email}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        console.log('Pending organizations response:', response);
        // The response is an array directly, not wrapped in institutionList
        return Array.isArray(response) ? response : [];
      })
    );
  }

  addOrganization(organization: CreateOrganizationRequest): Observable<Organization> {
    const user = this.authService.getCurrentUser();
    const payload = {
      ...organization,
      type: organization.type === 'Upstream' ? 'U' : 'D',
      createdBy: user?.email || ''
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
      type: organization.type === 'Upstream' ? 'U' : 'D'
    };

    return this.http.patch<Organization>(
      `${this.apiUrl}/admin/institution/api/v1/init_update_institution`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  approveOrganization(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/admin/institution/api/v1/approve_institution/${id}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  rejectOrganization(id: string, reason: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/admin/institution/api/v1/reject_institution/${id}`,
      { reason },
      { headers: this.getHeaders() }
    );
  }

  deleteOrganization(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/admin/institution/api/v1/delete_institution/${id}`,
      { headers: this.getHeaders() }
    );
  }
}