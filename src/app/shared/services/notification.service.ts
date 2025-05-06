import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: Date;
  read: boolean;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor() {
    // Initialize with some demo notifications
    this.addNotification({
      title: 'New Declaration',
      message: 'A new declaration has been submitted for review',
      type: 'info',
      link: '/declarations'
    });

    this.addNotification({
      title: 'System Update',
      message: 'The system will undergo maintenance in 2 hours',
      type: 'warning'
    });
  }

  addNotification(notification: Omit<Notification, 'id' | 'time' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2),
      time: new Date(),
      read: false
    };

    this.notifications.next([newNotification, ...this.notifications.value]);
  }

  markAsRead(id: string) {
    const updated = this.notifications.value.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    this.notifications.next(updated);
  }

  markAllAsRead() {
    const updated = this.notifications.value.map(notification => ({
      ...notification,
      read: true
    }));
    this.notifications.next(updated);
  }

  removeNotification(id: string) {
    const updated = this.notifications.value.filter(notification => notification.id !== id);
    this.notifications.next(updated);
  }

  clear() {
    this.notifications.next([]);
  }

  getUnreadCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }
}