import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Breadcrumb } from '../components/breadcrumb/breadcrumb.component';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
    // Use Promise.resolve().then to push the update to the next macrotask,
    // avoiding the ExpressionChangedAfterItHasBeenCheckedError
    Promise.resolve().then(() => {
      this.breadcrumbsSubject.next(breadcrumbs);
    });
  }
}