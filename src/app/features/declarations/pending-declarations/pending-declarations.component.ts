import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component";
// import { DeclarationFormComponent } from "../declaration-form/declaration-form.component";

@Component({
  selector: "app-pending-nominations",
  standalone: true,
  imports: [
    CommonModule,
    // DeclarationFormComponent,
    // DataTableComponent,
    // ButtonComponent,
  ],
  template: `
    <div class="p-4">
      <!-- <h1 class="text-2xl font-bold mb-6">Nominations</h1> -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500">
          Pending Declaration functionality coming soon...
        </p>
      </div>
    </div>
  `,
})
export class PendingDeclarationsComponent {}
