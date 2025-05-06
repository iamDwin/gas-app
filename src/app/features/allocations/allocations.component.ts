import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allocations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Allocations</h2>
      <!-- Allocations content will go here -->
    </div>
  `
})
export class AllocationsComponent {}