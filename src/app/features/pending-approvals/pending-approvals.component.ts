import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Pending Approvals</h2>
      <!-- Pending approvals content will go here -->
    </div>
  `
})
export class PendingApprovalsComponent {}