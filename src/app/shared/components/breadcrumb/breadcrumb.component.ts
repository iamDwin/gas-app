import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Breadcrumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li>
          <div>
            <a routerLink="/" class="text-gray-400 hover:text-gray-500">
              Dashboard
            </a>
          </div>
        </li>
        <li *ngFor="let item of items; let last = last">
          <div class="flex items-center">
            <span class="text-gray-400 mx-2">/</span>
            <a 
              [routerLink]="item.link" 
              [class.text-gray-500]="!last"
              [class.text-gray-900]="last"
              [class.font-medium]="last"
              class="hover:text-gray-700"
            >
              {{ item.label }}
            </a>
          </div>
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input() items: Breadcrumb[] = [];
}