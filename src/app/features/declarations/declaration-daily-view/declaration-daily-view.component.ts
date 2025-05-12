import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Declaration, DailyQuantity } from "../declaration.model";
import { DeclarationService } from "../declaration.service";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-declaration-daily-view",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <!-- Declaration Details -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Declaration Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Institution Code</p>
            <p class="font-medium">{{ declaration?.institutionCode }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Declared Quantity</p>
            <p class="font-medium">
              {{ declaration?.declaredQuantity }} units/day
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Start Date</p>
            <p class="font-medium">{{ formatDate(declaration?.startDate) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">End Date</p>
            <p class="font-medium">{{ formatDate(declaration?.endDate) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <p class="font-medium">{{ declaration?.status }}</p>
          </div>
        </div>
      </div>

      <!-- Daily Quantities -->
      <div class="bg-white rounded-lg shadow-sm">
        <!-- Header with Date Filter -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Daily Quantities</h3>
            <div class="flex items-center gap-2">
              <input
                type="date"
                [min]="declaration?.startDate"
                [max]="declaration?.endDate"
                [(ngModel)]="selectedDate"
                (change)="onDateSelected()"
                class="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let day of currentPageData">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(day.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ng-container *ngIf="!isEditing(day.date)">
                    {{ day.quantity }} units
                  </ng-container>
                  <input
                    *ngIf="isEditing(day.date)"
                    type="number"
                    [value]="day.quantity"
                    (input)="updateQuantity($event, day.date)"
                    class="w-32 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <button
                    *ngIf="!isEditing(day.date)"
                    (click)="startEditing(day.date)"
                    class="text-primary hover:text-primary-dark"
                  >
                    Edit
                  </button>
                  <ng-container *ngIf="isEditing(day.date)">
                    <button
                      (click)="saveEdit(day.date)"
                      class="text-green-600 hover:text-green-700 mr-2"
                    >
                      Save
                    </button>
                    <button
                      (click)="cancelEdit(day.date)"
                      class="text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </button>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer with Pagination -->
        <div
          class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
        >
          <div class="text-sm text-gray-700">
            Week {{ currentPage }} of {{ totalPages }} ({{
              formatDate(currentWeekStart)
            }}
            - {{ formatDate(currentWeekEnd) }})
          </div>
          <div class="flex items-center gap-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 1"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Week
            </button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage === totalPages"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Week
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DeclarationDailyViewComponent implements OnInit {
  declaration?: Declaration;
  editingDates = new Set<string>();
  originalQuantities = new Map<string, number>();
  selectedDate?: string;

  // Pagination
  currentPage = 1;
  pageSize = 7; // One week
  totalPages = 1;
  currentPageData: DailyQuantity[] = [];
  currentWeekStart?: string;
  currentWeekEnd?: string;

  constructor(
    private route: ActivatedRoute,
    private declarationService: DeclarationService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.loadDeclaration(id);
    });
  }

  loadDeclaration(id: string) {
    this.declarationService.getDeclaration(id).subscribe((declaration) => {
      if (declaration) {
        this.declaration = declaration;
        this.calculateTotalPages();
        this.loadCurrentPage();
        this.breadcrumbService.setBreadcrumbs([
          { label: "Declarations", link: "/declarations" },
          {
            label: declaration.institutionCode,
            link: `/declarations/${declaration.id}`,
          },
        ]);
      }
    });
  }

  calculateTotalPages() {
    if (this.declaration) {
      this.totalPages = Math.ceil(
        this.declaration.dailyQuantities.length / this.pageSize
      );
    }
  }

  loadCurrentPage() {
    if (!this.declaration) return;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.currentPageData = this.declaration.dailyQuantities.slice(
      startIndex,
      endIndex
    );

    if (this.currentPageData.length > 0) {
      this.currentWeekStart = this.currentPageData[0].date;
      this.currentWeekEnd =
        this.currentPageData[this.currentPageData.length - 1].date;
    }
  }

  onDateSelected() {
    if (!this.selectedDate || !this.declaration) return;

    // Find the week that contains the selected date
    const index = this.declaration.dailyQuantities.findIndex(
      (dq) => dq.date === this.selectedDate
    );
    if (index !== -1) {
      this.currentPage = Math.floor(index / this.pageSize) + 1;
      this.loadCurrentPage();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCurrentPage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCurrentPage();
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  isEditing(date: string): boolean {
    return this.editingDates.has(date);
  }

  startEditing(date: string) {
    const quantity = this.declaration?.dailyQuantities.find(
      (dq) => dq.date === date
    )?.quantity;
    if (quantity !== undefined) {
      this.originalQuantities.set(date, quantity);
      this.editingDates.add(date);
    }
  }

  updateQuantity(event: Event, date: string) {
    const input = event.target as HTMLInputElement;
    const quantity = Number(input.value);

    if (this.declaration) {
      this.declaration.dailyQuantities = this.declaration.dailyQuantities.map(
        (dq) => (dq.date === date ? { ...dq, quantity } : dq)
      );
      this.loadCurrentPage();
    }
  }

  saveEdit(date: string) {
    if (this.declaration) {
      const quantity = this.declaration.dailyQuantities.find(
        (dq) => dq.date === date
      )?.quantity;
      if (quantity !== undefined) {
        this.declarationService.updateDailyQuantity(
          this.declaration.id,
          date,
          quantity
        );
        this.notificationService.addNotification({
          title: "Quantity Updated",
          message: `Quantity for ${this.formatDate(date)} has been updated`,
          type: "success",
        });
      }
    }
    this.editingDates.delete(date);
    this.originalQuantities.delete(date);
  }

  cancelEdit(date: string) {
    const originalQuantity = this.originalQuantities.get(date);
    if (originalQuantity !== undefined && this.declaration) {
      this.declaration.dailyQuantities = this.declaration.dailyQuantities.map(
        (dq) => (dq.date === date ? { ...dq, quantity: originalQuantity } : dq)
      );
      this.loadCurrentPage();
    }
    this.editingDates.delete(date);
    this.originalQuantities.delete(date);
  }
}
