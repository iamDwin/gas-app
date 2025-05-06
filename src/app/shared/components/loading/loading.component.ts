import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="show"
      class="loading-overlay"
    >
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">{{ message }}</p>
      </div>
    </div>
  `
})
export class LoadingComponent {
  @Input() show = false;
  @Input() message = 'Loading...';
}