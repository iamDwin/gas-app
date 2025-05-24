import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NominationService } from "../nominations.service";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";

@Component({
  selector: "app-pending-nominations",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pending-nominations.component.html",
})
export class PendingNominationsComponent implements OnInit {
  constructor(
    private nominationService: NominationService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Nominations", link: "/nominations" },
      { label: "Pending Nominations", link: "/nominations/pending" },
    ]);
  }
}
