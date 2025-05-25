import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NominationService } from "../nominations.service";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import {
  DataTableComponent,
  TableAction,
} from "../../../shared/components/data-table/data-table.component";
import { FormsComponent } from "../forms/forms.component";
import { Nomination } from "../nominations.model";
import { Router } from "@angular/router";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-pending-nominations",
  standalone: true,
  imports: [CommonModule, DataTableComponent, FormsComponent],
  templateUrl: "./pending-nominations.component.html",
})
export class PendingNominationsComponent implements OnInit {
  isLoading: boolean = false;
  loadingMessage = "loading...";
  formattedNominations: any[] = [];
  isDrawerOpen = false;
  selectedNomination?: Nomination;
  nominations?: Nomination[];

  columns = [
    { prop: "id", name: "#" },
    { prop: "declaredQuantity", name: "Quantity" },
    { prop: "startDate", name: "Start Date" },
    { prop: "endDate", name: "End Date" },
    { prop: "period", name: "Period" },
    // { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    // {
    //   label: "View Details",
    //   type: "primary",
    // },
    {
      label: "Nominate",
      type: "success",
    },
    // {
    //   label: "Edit",
    //   type: "primary",
    //   isDisabled: (row: Nomination) => row.status !== "draft",
    // },
    // {
    //   label: "Delete",
    //   type: "danger",
    //   isDisabled: (row: Nomination) => row.status !== "draft",
    // },
  ];

  constructor(
    private nominationService: NominationService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Nominations", link: "/nominations" },
      { label: "Pending Nominations", link: "/nominations/pending" },
    ]);

    this.loadPendingNominations();
  }

  loadPendingNominations() {
    this.isLoading = true;
    this.nominationService
      .getPendingNominations()
      .subscribe((nomination: any) => {
        this.nominations = nomination;
        this.formatDeclarations(nomination);
        this.isLoading = false;
      });
  }

  formatDeclarations(nominations: any[]) {
    this.formattedNominations = nominations.map((nominations) => ({
      ...nominations,
      startDate: this.formatDate(nominations.periodStartDate),
      endDate: this.formatDate(nominations.periodEndDate),
    }));
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  onActionClick(event: { action: TableAction; row: Nomination }) {
    switch (event.action.label) {
      case "View Details":
        // this.router.navigate(["/nominations", event.row.id]);
        break;
      case "Nominate":
        this.openDrawer(event.row);
        break;
      case "Delete":
        // this.deleteDeclaration(event.row.id);
        break;
    }
  }

  openDrawer(data: any) {
    this.selectedNomination = data;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedNomination = undefined;
  }

  saveDeclaration(data: any) {
    console.log(data);
    this.isLoading = true;
    this.nominationService.nominate(data).subscribe({
      next: (response) => {
        console.log(response);
        this.toaster.show({
          title: "Create Declaration Action",
          message: `${response.errorMessage}`,
          type: response.errorCode == "1" ? "error" : "success",
        });
      },
      error: (error) => {
        console.log(error);
        this.toaster.show({
          title: "Create Declaration Action",
          message: `${error.errorMessage}`,
          type: error.errorCode == "1" ? "error" : "success",
        });
      },
      complete: () => {
        this.isLoading = false;
        this.closeDrawer();
        this.loadPendingNominations();
      },
    });
  }
}
