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
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: "app-data-table",
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule, ButtonComponent],
  templateUrl: "./data-table.component.html",
})
export class DataTableComponent {
  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() defaultSort: string = "id";
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() loadingMessage = "Loading...";
  @Input() getActionsForRow?: (row: any) => TableAction[];

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

  getActions(row: any): TableAction[] {
    return this.getActionsForRow ? this.getActionsForRow(row) : this.actions;
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

  getStatusBadgeClass(status: string | number): string {
    switch (status) {
      case "Pending Approval":
        return "bg-yellow-500 text-white";
      case "Pending Nomination":
        return "bg-gray-500 text-white";
      case 0:
        return "bg-yellow-500 text-white";
      case "Approved":
        return "bg-green-500 text-white";
      case 1:
        return "bg-green-500 text-white";
      case "Declined":
        return "bg-red-500 text-white";
      case 2:
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  }
}

export interface TableAction {
  label: string;
  type: "primary" | "danger" | "success" | "warning" | "default";
  isDisabled?: (row: any) => boolean;
}
