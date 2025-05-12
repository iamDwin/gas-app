import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Organization } from "../../../features/organizations/organization.model";

export interface Institution {
  id: string;
  name: string;
  code: string;
}

@Component({
  selector: "app-institution-dropdown",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <div class="w-full cursor-pointer" (click)="toggleDropdown()">
        <div class="relative">
          <input
            type="text"
            [value]="selectedInstitution?.name || ''"
            [placeholder]="placeholder"
            readonly
            class="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Dropdown -->
      <div
        *ngIf="isOpen"
        class="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200"
      >
        <!-- Search -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-2">
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterInstitutions()"
              placeholder="Search institutions..."
              class="w-full h-10 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              (click)="$event.stopPropagation()"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                class="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Options -->
        <div class="py-1">
          <div
            *ngFor="let institution of filteredInstitutions"
            (click)="selectInstitution(institution)"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <div class="flex-1">
              <div class="font-medium">{{ institution.name }}</div>
              <div class="text-xs text-gray-500">{{ institution.code }}</div>
              <div class="text-xs text-gray-500">
                {{
                  institution.type === "U"
                    ? "UPSTREAM"
                    : institution.type === "D"
                    ? "DOWNSTREAM"
                    : institution.type === "M"
                    ? "MIDSTREAM"
                    : "UNKNOWN"
                }}
              </div>
            </div>
            <svg
              *ngIf="institution.id === selectedInstitution?.id"
              class="h-5 w-5 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div
            *ngIf="filteredInstitutions.length === 0"
            class="px-4 py-2 text-sm text-gray-500 text-center"
          >
            No institutions found
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class InstitutionDropdownComponent {
  @Input() institutions: Organization[] = [];
  @Input() placeholder = "Select an institution";
  @Input() selectedInstitution?: Organization;
  @Output() institutionSelected = new EventEmitter<Organization>();

  isOpen = false;
  searchTerm = "";
  filteredInstitutions: Organization[] = [];

  ngOnInit() {
    this.filteredInstitutions = this.institutions;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterInstitutions();
    }
  }

  filterInstitutions() {
    const search = this.searchTerm.toLowerCase();
    this.filteredInstitutions = this.institutions.filter(
      (institution) =>
        institution.name.toLowerCase().includes(search) ||
        institution.code.toLowerCase().includes(search)
    );
  }

  selectInstitution(institution: Organization) {
    this.selectedInstitution = institution;
    this.institutionSelected.emit(institution);
    this.isOpen = false;
  }

  // Close dropdown when clicking outside
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest("app-institution-dropdown")) {
      this.isOpen = false;
    }
  }
}
