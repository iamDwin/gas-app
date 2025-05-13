import { Component, OnInit, HostListener, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  NotificationService,
  Notification,
} from "../../services/notification.service";

@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative" #notificationsContainer>
      <button
        (click)="toggleDropdown($event)"
        class="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
      >
        <span class="sr-only">View notifications</span>
        <!-- Bell Icon -->
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0h-6"
          />
        </svg>

        <!-- Notification Badge -->
        <span
          *ngIf="unreadCount > 0"
          class="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium"
        >
          {{ unreadCount }}
        </span>
      </button>

      <!-- Dropdown -->
      <div
        *ngIf="isOpen"
        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-[480px] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
          <button
            *ngIf="unreadCount > 0"
            (click)="markAllAsRead()"
            class="text-sm text-primary hover:text-primary/90"
          >
            Mark all as read
          </button>
        </div>

        <!-- Notifications List -->
        <div class="overflow-y-auto flex-1">
          <div
            *ngIf="notifications.length === 0"
            class="p-4 text-center text-gray-500"
          >
            No notifications
          </div>

          <div
            *ngFor="let notification of notifications"
            class="block border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors duration-150 relative group"
            [class.bg-blue-50]="!notification.read"
          >
            <a
              [routerLink]="notification.link"
              (click)="markAsRead(notification.id)"
              class="p-4 block"
            >
              <div class="flex items-start">
                <!-- Notification Icon -->
                <span
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  [class.bg-blue-100]="notification.type === 'info'"
                  [class.bg-green-100]="notification.type === 'success'"
                  [class.bg-yellow-100]="notification.type === 'warning'"
                  [class.bg-red-100]="notification.type === 'error'"
                >
                  <svg
                    class="w-4 h-4"
                    [class.text-blue-500]="notification.type === 'info'"
                    [class.text-green-500]="notification.type === 'success'"
                    [class.text-yellow-500]="notification.type === 'warning'"
                    [class.text-red-500]="notification.type === 'error'"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      *ngIf="notification.type === 'info'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      *ngIf="notification.type === 'success'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      *ngIf="notification.type === 'warning'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                    <path
                      *ngIf="notification.type === 'error'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>

                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-500 line-clamp-2">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ notification.time | date : "short" }}
                  </p>
                </div>

                <span
                  *ngIf="!notification.read"
                  class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"
                ></span>
              </div>
            </a>

            <!-- Remove button -->
            <button
              (click)="removeNotification(notification.id)"
              class="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div
          *ngIf="notifications.length > 0"
          class="p-2 border-t border-gray-200 bg-gray-50"
        >
          <button
            (click)="clear()"
            class="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md text-center transition-colors duration-150"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class NotificationsComponent implements OnInit {
  isOpen = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
      this.unreadCount = this.notificationService.getUnreadCount();
    });
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  removeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }

  clear() {
    this.notificationService.clear();
    this.isOpen = false;
  }
}
