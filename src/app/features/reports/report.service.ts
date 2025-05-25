import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/auth/auth.service";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Declaration } from "../declarations/declaration.model";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();

    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  getApprovadDeclarations(): Observable<Declaration[]> {
    const user = this.authService.getCurrentUser();
    let path = "";
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    if (user.type == "M" || user.type == "G")
      path = `get_pending_declarations_midstream/${user.name}`;
    else path = `get_pending_declarations/${user.organizationId}/${user.name}`;

    return this.http
      .get<any>(`${this.apiUrl}/declaration/api/v1/${path}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response || []));
  }

  getApprovadNomination(): Observable<Declaration[]> {
    const user = this.authService.getCurrentUser();
    let path = "";
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    // if (user.type == "M" || user.type == "G")
    //   path = `get_approved_nominations_midstream/${user.name}`;
    // else
    path = `get_approved_nomination/${user.organizationId}/${user.name}`;

    return this.http
      .get<any>(`${this.apiUrl}/declaration/api/v1/${path}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response || []));
  }

  getApprovadSchedules(): Observable<Declaration[]> {
    const user = this.authService.getCurrentUser();
    let path = "";
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    if (user.type == "M" || user.type == "G")
      path = `get_approved_declarations_midstream/${user.name}`;
    else path = `get_approved_declarations/${user.organizationId}/${user.name}`;

    return this.http
      .get<any>(`${this.apiUrl}/declaration/api/v1/${path}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response || []));
  }

  downloadReport(id: string): Observable<any> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    let url =
      user.type == "U"
        ? `/declaration/api/v1/export_declaration_report_upstream/${id}/${user.name}`
        : `/declaration/api/v1/export_declaration_report_upstream/${id}/${user.name}`;
    const payload = {
      requestId: id,
      username: user.name,
    };
    return this.http
      .post<any>(
        `${this.apiUrl}${url}`,
        { ...payload },
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(map((response) => response));
  }
}
