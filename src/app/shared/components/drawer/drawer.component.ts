import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="drawer"
      [class.drawer-open]="isOpen"
      [class.drawer-closed]="!isOpen"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        </div>
        <button 
          (click)="close.emit()"
          class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
        >
          <span class="sr-only">Close drawer</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <ng-content select="[drawerContent]"></ng-content>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 p-6">
        <ng-content select="[drawerFooter]"></ng-content>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      *ngIf="isOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
      (click)="close.emit()"
    ></div>
  `
})
export class DrawerComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}