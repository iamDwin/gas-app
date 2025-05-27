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
import {
  ConfirmationModalComponent,
  ConfirmationModalConfig,
} from "../../../shared/components/confirmation-modal/confirmation-modal.component";
import { AuthService } from "../../../core/auth/auth.service";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-pending-nominations",
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    FormsComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: "./pending-nominations.component.html",
})
export class PendingNominationsComponent implements OnInit {
  isLoading: boolean = false;
  loadingMessage = "loading...";
  formattedNominations: any[] = [];
  isDrawerOpen = false;
  selectedNomination?: Nomination;
  nominations?: Nomination[];
  nominationToActivate: any;

  showConfirmModal = false;
  actAction: any;

  columns = [
    // { prop: "id", name: "#" },
    { prop: "institutionName", name: "Institution" },
    { prop: "declaredQuantity", name: "Quantity" },
    { prop: "periodStartDate", name: "Start Date" },
    { prop: "periodEndDate", name: "End Date" },
    { prop: "period", name: "Period" },
    { prop: "nominationStatus", name: "Status" },
    // { prop: "nominationApprovalStatus", name: "Approval Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "View Details",
      type: "primary",
    },
    {
      label: "Nominate",
      type: "success",
      isDisabled: (row: Nomination) => {
        return row.nominationBy !== null;
      },
    },
    {
      label: "Approve Nomination",
      type: "primary",
      isDisabled: (row: Nomination) => {
        return row.nominationBy === null;
      },
    },
    {
      label: "Decline Nomination",
      type: "danger",
      isDisabled: (row: Nomination) => {
        return row.nominationBy === null;
      },
    },
  ];

  approveDeclarationConfig: ConfirmationModalConfig = {
    title: "Approve Nomination",
    message: "Are you sure you want to approve this nomination ?",
    confirmText: "Approve Nomination",
    cancelText: "Cancel",
    type: "warning",
  };
  declineDeclarationConfig: ConfirmationModalConfig = {
    title: "Decline Nomination",
    message: "Are you sure you want to decline this nomination ?",
    confirmText: "Decline Nomination",
    cancelText: "Cancel",
    type: "danger",
  };
  activateModalMessage: ConfirmationModalConfig = this.approveDeclarationConfig;

  constructor(
    private nominationService: NominationService,
    private breadcrumbService: BreadcrumbService,
    private toaster: ToastService,
    private authService: AuthService,
    private notify: NotificationService,
    private router: Router
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
        console.log({ nomination });
        this.nominations = nomination;
        this.formatDeclarations(nomination);
        this.isLoading = false;
      });
  }

  formatDeclarations(nominations: any[]) {
    this.formattedNominations = nominations
      .filter((nomination) => nomination.declarationStatus === 1)
      .map((nomination) => ({
        ...nomination,
        // periodStartDate: this.formatDate(nomination.periodStartDate),
        // periodEndDate: this.formatDate(nomination.periodEndDate),

        nominationStatus: this.getEffectiveStatus(nomination),
        // nominationStatus: this.getNominationStatus(nomination.nominationStatus),
        // nominationApprovalStatus: this.getDeclarationStatus(
        //   nomination.nominationStatus
        // ),
      }));
  }

  disableActions(nomination: any): string {
    if (
      nomination.nominationStatus === 1 &&
      nomination.nominationApprovalStatus == 0
    ) {
      return this.getDeclarationStatus(nomination.nominationApprovalStatus);
    } else if (
      nomination.nominationStatus === 0 ||
      nomination.nominationStatus === 2
    ) {
      return this.getNominationStatus(nomination.nominationStatus);
    }
    return "";
  }

  getEffectiveStatus(nomination: any): string {
    if (
      nomination.nominationStatus === 1 &&
      nomination.nominationApprovalStatus == 0
    ) {
      return this.getDeclarationStatus(nomination.nominationApprovalStatus);
    } else if (
      nomination.nominationStatus === 0 ||
      nomination.nominationStatus === 2
    ) {
      return this.getNominationStatus(nomination.nominationStatus);
    }
    return "";
  }

  checkNominationBy(nomination: any): boolean {
    if (nomination.nominationBy === null) {
      nomination.nominationStatus = this.getNominationStatus(0); // Pending Approval
      return true;
    }
    return nomination.declarationStatus === 1;
  }

  getNominationStatus(status: number): string {
    switch (status) {
      case 0:
        return "Pending Nomination";
      case 1:
        return "Approved";
      case 2:
        return "Declined";
      default:
        return "Unknown Status";
    }
  }

  getDeclarationStatus(status: number): string {
    switch (status) {
      case 0:
        return "Pending Approval";
      case 1:
        return "Approved";
      case 2:
        return "Declined";
      default:
        return "Unknown Status";
    }
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
        this.router.navigate(["/nominations", event.row.requestId]);
        break;
      case "Nominate":
        this.openDrawer(event.row);
        break;
      case "Approve Nomination":
        this.nominationAction(event.row, "Approve Nomination");
        break;
      case "Decline Nomination":
        this.nominationAction(event.row, "Decline Nomination");
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

  nominate(data: any) {
    // console.log(data);
    this.isLoading = true;
    this.nominationService.nominate(data).subscribe({
      next: (response) => {
        // console.log({ response });
        this.toaster.show({
          title: "Create Declaration Action",
          message: `${response.errorMessage}`,
          type: response.errorCode == "1" ? "error" : "success",
        });
      },
      error: (error) => {
        // console.log({error});
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

  nominationAction(data: any, action: string) {
    if (action === "Approve Nomination")
      this.activateModalMessage = this.approveDeclarationConfig;
    else this.activateModalMessage = this.declineDeclarationConfig;
    this.showConfirmModal = true;
    this.nominationToActivate = data;
    this.actAction = action;
    console.log({ data, action }, this.nominationToActivate);
  }

  cancelActivate() {
    this.showConfirmModal = false;
    this.nominationToActivate = undefined;
    this.actAction = "";
  }

  confirmAction = () => {
    this.isLoading = true;
    this.showConfirmModal = false;
    this.loadingMessage = "Performing Action...";
    let currentUser = this.authService.getCurrentUser();
    let payload = {
      id: this.nominationToActivate.id.toString(),
      by: currentUser?.name,
      comment: `${this.actAction} nomination`,
    };

    if (this.actAction == "Approve Nomination") {
      this.nominationService
        .approveNomination(payload, this.actAction)
        .subscribe({
          next: (response) => {
            console.log({ response });
            this.isLoading = false;
            this.notify.addNotification({
              title: "Declaration Request",
              message: `${response.errorMessage}`,
              type: response.errorCode == "1" ? "error" : "success",
            });
            this.toaster.show({
              title: "Declaration Request",
              message: `${response.errorMessage}`,
              type: response.errorCode == "1" ? "error" : "success",
            });
          },
          error: (error) => {
            this.isLoading = false;
            this.notify.addNotification({
              title: "Declaration Request",
              message: `${error.errorMessage}`,
              type: error.errorCode == "1" ? "error" : "success",
            });
            this.toaster.show({
              title: "Declaration Request",
              message: `${error.errorMessage}`,
              type: error.errorCode == "1" ? "error" : "success",
            });
          },
          complete: () => {
            this.isLoading = false;
            this.loadPendingNominations();
          },
        });
    } else {
      this.nominationService
        .declineNomination(payload, this.actAction)
        .subscribe((response) => {
          // console.log(response);
          this.isLoading = false;
          this.toaster.show({
            title: "Declaration Request",
            message: `${response.errorMessage}`,
            type: response.errorCode == "1" ? "error" : "success",
          });
        });
      this.loadPendingNominations();
      this.isLoading = false;
    }
  };
}
