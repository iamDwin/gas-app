// searchable-dropdown.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Subject, takeUntil } from "rxjs";

export interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: "app-searchable-dropdown",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: `./searchable-dropdown.component.html`,
  styleUrl: `./searchable-dropdown.component.css`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableDropdownComponent),
      multi: true,
    },
  ],
})
export class SearchableDropdownComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = "Select an option";
  @Input() searchable: boolean = true;
  @Input() searchPlaceholder: string = "Search...";
  @Input() noOptionsText: string = "No options found";
  @Input() disabled: boolean = false;

  // ADD these @Output properties after your @Input properties
  @Output() selectionChange = new EventEmitter<DropdownOption>();
  @Output() valueChange = new EventEmitter<any>();
  @Output() dropdownOpen = new EventEmitter<boolean>();
  @Output() searchChange = new EventEmitter<string>();

  isOpen = false;
  selectedOption: DropdownOption | null = null;
  filteredOptions: DropdownOption[] = [];
  searchControl = new FormControl("");
  private destroy$ = new Subject<void>();

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.filteredOptions = [...this.options];

    // Subscribe to search input changes
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        const term = searchTerm || "";
        this.filterOptions(term);
        this.searchChange.emit(term); // ADD this line
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.selectedOption =
        this.options.find((option) => option.value === value) || null;
    } else {
      this.selectedOption = null;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchControl.setValue("");
      this.filteredOptions = [...this.options];
    }
    this.dropdownOpen.emit(this.isOpen); // ADD this line
    this.onTouched();
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.dropdownOpen.emit(false); // ADD this line
  }

  selectOption(option: DropdownOption): void {
    this.selectedOption = option;
    this.onChange(option.value);
    this.selectionChange.emit(option); // ADD this line
    this.valueChange.emit(option.value); // ADD this line
    this.closeDropdown();
  }

  isSelected(option: DropdownOption): boolean {
    return this.selectedOption?.value === option.value;
  }

  private filterOptions(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredOptions = [...this.options];
      return;
    }

    this.filteredOptions = this.options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  trackByValue(index: number, option: DropdownOption): any {
    return option.value;
  }
}
