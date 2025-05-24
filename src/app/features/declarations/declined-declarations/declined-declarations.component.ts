import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component";

@Component({
  selector: "app-declined-declarations",
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: "./declined-declarations.component.html",
})
export class DeclinedDeclarationsComponent implements OnInit {
  constructor(private breadcrumService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumService.setBreadcrumbs([
      { label: "Declarations", link: "/declarations" },
      { label: "Declined Declarations", link: "/declarations/declined" },
    ]);
  }
}
