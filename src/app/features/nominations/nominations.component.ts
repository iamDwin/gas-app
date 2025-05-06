import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nominations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Nominations</h2>
      <!-- Nominations content will go here -->
    </div>
  `
})
export class NominationsComponent {}