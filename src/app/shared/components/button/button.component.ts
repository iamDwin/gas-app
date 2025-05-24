import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

export type ButtonVariant =
  | "default"
  | "semiFilled"
  | "filled"
  | "danger"
  | "warning"
  | "semiFilledDanger"
  | "defaultDanger"
  | "semiFilledWarning"
  | "defaultWarning";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
      [class]="getButtonClasses()"
    >
      <ng-container *ngIf="loading">
        <div
          class="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2"
        ></div>
      </ng-container>

      <ng-container *ngIf="!loading && iconLeft">
        <span class="mr-2" [innerHTML]="iconLeft"></span>
      </ng-container>

      <ng-content></ng-content>

      <ng-container *ngIf="!loading && iconRight">
        <span class="ml-2" [innerHTML]="iconRight"></span>
      </ng-container>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = "default";
  @Input() type: "button" | "submit" = "button";
  @Input() disabled = false;
  @Input() loading = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() fullWidth = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClasses(): string {
    const baseClasses =
      "inline-flex w-max items-center h-10 px-3 rounded-xl transition-all text-[14px] font-normal";
    const widthClass = this.fullWidth ? "w-full" : "";

    const variantClasses = {
      default:
        "border border-transparent hover:!border-[#75E0A7] hover:!bg-[#ECFDF3] active:!bg-[#DCFAE6] active:!border-[#75E0A7]",
      semiFilled:
        "border border-[#D5D7DA] bg-gradient-to-b from-white to-[#FAFAFA] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] hover:border-[#75E0A7] hover:bg-gradient-to-b hover:from-white hover:to-[#ECFDF3] hover:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] active:border-[#47CD89] active:bg-gradient-to-b active:from-[#DCFAE6] active:to-[#ABEFC6] active:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]",
      filled:
        "border border-[#47CD89] bg-gradient-to-b from-[#DCFAE6] to-[#ABEFC6] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] hover:border-[#47CD89] hover:bg-gradient-to-b hover:from-[#ABEFC6] hover:to-[#75E0A7] hover:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] active:border-[#47CD89] active:bg-gradient-to-b active:from-[#75E0A7] active:to-[#47CD89] active:shadow-[0px_20px_0px_0px_rgba(255,255,255,0.05)_inset,0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]",
      danger:
        "border border-[#E57373] bg-gradient-to-b from-[#FFCDD2] to-[#E57373] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] hover:border-[#E57373] hover:bg-gradient-to-b hover:from-[#EF9A9A] hover:to-[#E57373] hover:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] active:border-[#D32F2F] active:bg-gradient-to-b active:from-[#E57373] active:to-[#D32F2F] active:shadow-[0px_20px_0px_0px_rgba(255,255,255,0.05)_inset,0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]",
      warning:
        "border border-[#FFB74D] bg-gradient-to-b from-[#FFE0B2] to-[#FFB74D] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] hover:border-[#FFB74D] hover:bg-gradient-to-b hover:from-[#FFCC80] hover:to-[#FFB74D] hover:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] active:border-[#F57C00] active:bg-gradient-to-b active:from-[#FFB74D] active:to-[#F57C00] active:shadow-[0px_20px_0px_0px_rgba(255,255,255,0.05)_inset,0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]",
      semiFilledDanger:
        "border border-[#E57373] bg-gradient-to-b from-white to-[#FFCDD2] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] hover:border-[#E57373] hover:bg-gradient-to-b hover:from-white hover:to-[#EF9A9A] hover:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] active:border-[#D32F2F] active:bg-gradient-to-b active:from-[#FFCDD2] active:to-[#E57373] active:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]",
      defaultDanger:
        "border border-transparent hover:!border-[#E57373] hover:!bg-[#FFCDD2] active:!bg-[#EF9A9A] active:!border-[#E57373]",
      semiFilledWarning:
        "border border-[#FFB74D] bg-gradient-to-b from-white to-[#FFE0B2] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] hover:border-[#FFB74D] hover:bg-gradient-to-b hover:from-white hover:to-[#FFCC80] hover:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] active:border-[#F57C00] active:bg-gradient-to-b active:from-[#FFE0B2] active:to-[#FFB74D] active:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]",
      defaultWarning:
        "border border-transparent hover:!border-[#FFB74D] hover:!bg-[#FFE0B2] active:!bg-[#FFCC80] active:!border-[#FFB74D]",
    };

    const disabledClass =
      this.disabled || this.loading ? "opacity-50 cursor-not-allowed" : "";

    return `${baseClasses} ${
      variantClasses[this.variant]
    } ${widthClass} ${disabledClass}`;
  }
}
