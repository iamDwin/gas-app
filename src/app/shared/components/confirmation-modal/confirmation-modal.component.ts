import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface ConfirmationModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  icon?: string;
}

@Component({
  selector: "app-confirmation-modal",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      [class]="overlayClass"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div [class]="iconContainerClass">
                  <span [innerHTML]="config.icon || defaultIcon"></span>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    class="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    {{ config.title }}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">{{ config.message }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
            >
              <button
                type="button"
                [class]="confirmButtonClass"
                (click)="onConfirm.emit()"
              >
                {{ config.confirmText || "Confirm" }}
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                (click)="onCancel.emit()"
              >
                {{ config.cancelText || "Cancel" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmationModalComponent {
  @Input() show = false;
  @Input() config: ConfirmationModalConfig = {
    title: "",
    message: "",
    type: "danger",
  };

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  get overlayClass(): string {
    return this.config.type === "danger"
      ? "bg-red-100/10"
      : this.config.type === "warning"
      ? "bg-yellow-100/10"
      : "bg-blue-100/10";
  }

  get iconContainerClass(): string {
    const baseClass =
      "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10";
    return this.config.type === "danger"
      ? `${baseClass} bg-red-100`
      : this.config.type === "warning"
      ? `${baseClass} bg-yellow-100`
      : `${baseClass} bg-blue-100`;
  }

  get confirmButtonClass(): string {
    const baseClass =
      "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto";
    return this.config.type === "danger"
      ? `${baseClass} bg-red-600 text-white hover:bg-red-500`
      : this.config.type === "warning"
      ? `${baseClass} bg-yellow-600 text-white hover:bg-yellow-500`
      : `${baseClass} bg-blue-600 text-white hover:bg-blue-500`;
  }

  get defaultIcon(): string {
    if (this.config.type === "danger") {
      return `<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>`;
    }
    if (this.config.type === "warning") {
      return `<svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>`;
    }
    return `<svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>`;
  }
}
