import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { animate, style, transition, trigger } from "@angular/animations";
import { ToastService, Toast } from "../../services/toast.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 left-4 z-50 flex flex-col gap-2" @toastAnimation>
      <div
        *ngFor="let toast of toasts"
        class="flex items-center gap-2 min-w-[300px] max-w-md p-4 text-sm rounded-lg shadow-lg"
        [ngClass]="getToastClasses(toast)"
        role="alert"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ toast.title }}</span>
          </div>
          <div *ngIf="toast.message" class="mt-1">{{ toast.message }}</div>
        </div>
        <button
          (click)="removeToast(toast.id)"
          class="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <span class="sr-only">Close</span>
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
  animations: [
    trigger("toastAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(100%)" }),
        animate(
          "300ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        ),
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ opacity: 0, transform: "translateY(100%)" })
        ),
      ]),
    ]),
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.toasts$.subscribe(
      (toasts) => (this.toasts = toasts)
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  getToastClasses(toast: Toast): string {
    const baseClasses = "flex items-center";
    switch (toast.type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
      default:
        return "bg-blue-100 text-blue-800";
    }
  }
}
