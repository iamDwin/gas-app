import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6">Reports</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500">Reports functionality coming soon...</p>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Reports', link: '/reports' }
    ]);
  }
}