import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6">Contracts</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500">Contracts functionality coming soon...</p>
      </div>
    </div>
  `
})
export class ContractsComponent {}