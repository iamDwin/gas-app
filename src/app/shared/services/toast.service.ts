import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();

  show(toast: Omit<Toast, 'id'>): void {
    const id = Math.random().toString(36).substring(2);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };

    this.toasts.next([...this.toasts.value, newToast]);

    // Auto remove after duration
    if (newToast.duration !== Infinity) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }
  }

  remove(id: string): void {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.next([]);
  }
}