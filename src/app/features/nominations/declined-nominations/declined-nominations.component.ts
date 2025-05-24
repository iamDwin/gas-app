import { Component, OnInit } from "@angular/core";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";

@Component({
  selector: "app-declined-nominations",
  standalone: true,
  imports: [],
  templateUrl: "./declined-nominations.component.html",
  // styleUrl: "./declined-nominations.component.css",
})
export class DeclinedNominationsComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Nominations", link: "/nominations" },
      { label: "Declined Nominations", link: "/nominations/declined" },
    ]);
  }
}
