import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/auth/auth.service";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ScheduleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();

    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  // getScheduleData() {}

  getScheduleData(date: string): Observable<any[]> {
    const user = this.authService.getCurrentUser();
    let path = "";
    if (!user) {
      return new Observable((subscriber) => subscriber.next([]));
    }

    if (user.type == "M" || user.type == "G")
      path = `/schedule/api/v1/get_schedules_by_date/${date}/${user.name}`;
    else path = `/schedule/api/v1/get_schedules_by_date/${date}/${user.name}`;

    return this.http
      .get<any>(`${this.apiUrl}${path}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response));
  }
}
