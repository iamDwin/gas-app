import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-data-table",
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Loading Overlay -->
      <div
        *ngIf="loading"
        class="absolute inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center"
      >
        <div class="text-center">
          <div
            class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">{{ loadingMessage }}</p>
        </div>
      </div>

      <!-- Table Header -->
      <div
        class="p-4 border-b border-gray-200 flex justify-between items-center"
      >
        <div class="flex items-center">
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch($event)"
              placeholder="Search..."
              class="h-10 pl-10 pr-4 block w-64 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div class="flex space-x-2">
          <ng-content select="[tableActions]"></ng-content>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto relative">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                *ngFor="let col of columns"
                [class.cursor-pointer]="col.sortable !== false"
                (click)="col.sortable !== false && sort(col.prop)"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
              >
                {{ col.name }}
                <span *ngIf="col.sortable !== false" class="ml-2 inline-block">
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let row of paginatedRows" class="hover:bg-gray-50">
              <td
                *ngFor="let col of columns"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                <ng-container
                  *ngIf="col.prop !== 'actions'; else actionsTemplate"
                >
                  {{ row[col.prop] }}
                </ng-container>
                <ng-template #actionsTemplate>
                  <div class="relative">
                    <button
                      (click)="toggleActionMenu($event, row)"
                      class="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500 focus:outline-none rounded-full hover:bg-gray-100"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    <!-- Dropdown Menu -->
                    <div
                      *ngIf="activeRow === row"
                      class="fixed mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-[100]"
                      [style.top]="dropdownTop + 'px'"
                      [style.left]="dropdownLeft + 'px'"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                    >
                      <div class="py-1" role="none">
                        <button
                          *ngFor="let action of actions"
                          (click)="onActionClick(action, row)"
                          [disabled]="
                            action.isDisabled && action.isDisabled(row)
                          "
                          class="text-sm w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          [class.text-gray-700]="action.type === 'primary'"
                          [class.text-red-600]="action.type === 'danger'"
                          [class.text-green-600]="action.type === 'success'"
                          [class.text-yellow-600]="action.type === 'warning'"
                          role="menuitem"
                        >
                          {{ action.label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </ng-template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 ml-4">
            Showing {{ startIndex + 1 }} to
            {{ Math.min(endIndex, filteredRows.length) }} of
            {{ filteredRows.length }} entries
          </span>

          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Show</span>
            <select
              [(ngModel)]="pageSize"
              (ngModelChange)="onPageSizeChange($event)"
              class="h-8 px-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option *ngFor="let size of pageSizeOptions" [value]="size">
                {{ size }}
              </option>
            </select>
            <span class="text-sm text-gray-600">entries</span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage >= totalPages"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DataTableComponent {
  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() defaultSort: string = "id";
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() loadingMessage = "Loading...";

  @Output() search = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<{ action: TableAction; row: any }>();

  searchTerm: string = "";
  filteredRows: any[] = [];
  activeRow: any = null;
  sortColumn: string = "";
  sortDirection: "asc" | "desc" = "asc";
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20, 50, 100];
  dropdownTop: number = 0;
  dropdownLeft: number = 0;
  Math = Math;

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Element;
    if (!target?.closest(".relative")) {
      this.activeRow = null;
    }
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return this.startIndex + this.pageSize;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRows.length / this.pageSize);
  }

  get paginatedRows(): any[] {
    return this.filteredRows.slice(this.startIndex, this.endIndex);
  }

  ngOnInit() {
    this.filteredRows = [...this.rows];
    this.sortColumn = this.defaultSort;
    this.sort(this.defaultSort);
  }

  ngOnChanges() {
    this.filteredRows = [...this.rows];
    this.applyFilter();
    if (this.sortColumn) {
      this.sort(this.sortColumn);
    }
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page when changing page size
  }

  toggleActionMenu(event: Event, row: any) {
    event.stopPropagation();

    if (this.activeRow === row) {
      this.activeRow = null;
      return;
    }

    const button = (event.target as Element).closest("button");
    if (button) {
      const rect = button.getBoundingClientRect();
      this.dropdownTop = rect.bottom + window.scrollY;
      this.dropdownLeft = rect.left - 120; // Adjust this value to position the dropdown
    }

    this.activeRow = row;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onSearch(value: string) {
    this.searchTerm = value;
    this.currentPage = 1;
    this.applyFilter();
    this.search.emit(value);
  }

  onActionClick(action: TableAction, row: any) {
    if (action.isDisabled && action.isDisabled(row)) {
      return;
    }
    this.actionClick.emit({ action, row });
    this.activeRow = null;
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }

    this.filteredRows.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal === bVal) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return this.sortDirection === "asc" ? comparison : -comparison;
    });
  }

  private applyFilter() {
    if (!this.searchTerm) {
      this.filteredRows = [...this.rows];
      return;
    }

    const searchStr = this.searchTerm.toLowerCase();
    this.filteredRows = this.rows.filter((row) => {
      return Object.keys(row).some((key) => {
        const value = row[key];
        if (value !== null && value !== undefined) {
          return value.toString().toLowerCase().includes(searchStr);
        }
        return false;
      });
    });
  }
}

export interface TableAction {
  label: string;
  type: "primary" | "danger" | "success" | "warning" | "default";
  isDisabled?: (row: any) => boolean;
}
