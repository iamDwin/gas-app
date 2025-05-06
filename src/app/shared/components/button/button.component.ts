import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'default' | 'semiFilled' | 'filled';

@Component({
  selector: 'app-button',
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
        <div class="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>
      </ng-container>
      
      <ng-container *ngIf="!loading && iconLeft">
        <span class="mr-2" [innerHTML]="iconLeft"></span>
      </ng-container>
      
      <ng-content></ng-content>
      
      <ng-container *ngIf="!loading && iconRight">
        <span class="ml-2" [innerHTML]="iconRight"></span>
      </ng-container>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() fullWidth = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center h-11 px-4 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const widthClass = this.fullWidth ? 'w-full' : '';
    
    const variantClasses = {
      default: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary',
      semiFilled: 'border border-primary text-primary bg-primary/10 hover:bg-primary/20 focus:ring-primary',
      filled: 'border border-transparent text-white bg-primary hover:bg-primary/90 focus:ring-primary'
    };

    const disabledClass = this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${widthClass} ${disabledClass}`;
  }
}