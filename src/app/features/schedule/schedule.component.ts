import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { AuthService } from "../../core/auth/auth.service";
import { FormsModule } from "@angular/forms";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { ScheduleService } from "./schedule.service";
import { ToastService } from "../../shared/services/toast.service";
import { NotificationService } from "../../shared/services/notification.service";

@Component({
  selector: "app-schedule",
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LoadingComponent],
  templateUrl: "./schedule.component.html",
})
export class ScheduleComponent implements OnInit {
  filterDate: string = "";
  defaultDate = new Date().toLocaleDateString("en-CA");
  isLoading = false;
  scheduleData: any;
  currentUser: any;

  editingDates = new Set<string>();
  scheduleDetails: any;
  originalQuantities = new Map<string, number>();
  schedule?: any;
  editedQuantity: any;
  // isEditing = false;

  scheduleColumn = [
    { prop: "requestId", name: "#" },
    { prop: "institutionCode", name: "# Code" },
    { prop: "institutionName", name: "Institution" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  constructor(
    private authService: AuthService,
    private scheduler: ScheduleService,
    private toaster: ToastService,
    private notify: NotificationService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Schedule", link: "/schedule" },
    ]);
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser);
    this.filterDate = this.defaultDate;
    this.getDefaultData();
  }

  applyDateFilter() {
    if (this.filterDate !== "" || this.filterDate !== null) {
      this.defaultDate = this.filterDate.toString();
    }
    this.getDefaultData();
  }

  getDefaultData() {
    this.isLoading = true;
    this.scheduler.getScheduleData(this.defaultDate).subscribe({
      next: (response) => {
        this.scheduleData = response;
      },
      error: () => {
        this.toaster.show({
          title: "Schedule Fetch Action",
          message: `Could get schedule for the selected date, Please try again`,
          type: "error",
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  getStatusBadgeClass(status: string | number): string {
    switch (status) {
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

  getStatus(status: number): string {
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

  isEditing(date: string): boolean {
    return date ? this.editingDates.has(date) : false;
  }

  startEditing(data: any) {
    console.log(data);
    this.scheduleDetails = data;
    this.schedule = data;

    const date = data.date;
    const quantity = this.scheduleData?.find(
      (dq: any) => dq.date === data.date
    )?.declaredQuantity;

    if (quantity !== undefined) {
      this.originalQuantities.set(date, quantity);
      this.editingDates.add(date);
    }
  }

  updateQuantity(event: Event, date: string) {
    const input = event.target as HTMLInputElement;
    const quantity = Number(input.value);

    if (this.schedule) {
      this.schedule.declaredQuantity = this.schedule.declaredQuantity.map(
        (dq: any) => (dq.date === date ? { ...dq, quantity } : dq)
      );
      // this.getDefaultData();
    }
  }

  saveEdit(data: any) {
    if (this.schedule) {
      const quantity = this.scheduleData.find(
        (dq: any) => dq.date === data.date
      )?.quantity;

      const newQuantity = this.editedQuantity;
      const dataToApprove = {
        ...data,
        declaredQuantity: newQuantity,
        updatedBy: this.authService.getCurrentUser()?.name,
        status: 1,
      };

      if (newQuantity !== undefined) {
        this.scheduler.updateSchedule(dataToApprove).subscribe({
          next: (response: any) => {
            console.log({ response });
            this.toaster.show({
              title: "Schedule Action",
              message: response.errorMessage || "Action on",
              type: response.errorCode === "0" ? "success" : "error",
            });
          },
          error: (error) => {
            console.log({ error });
            this.toaster.show({
              title: "Schedule Action",
              message:
                error.errorMessage || "An error occured, Please try again.",
              type: "error",
            });
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
            this.getDefaultData();
          },
        });
      }
    }
    this.editingDates.delete(data.date);
    this.originalQuantities.delete(data.date);
  }

  cancelEdit(date: string) {
    const originalQuantity = this.originalQuantities.get(date);
    if (originalQuantity !== undefined && this.schedule) {
      this.schedule.declaredQuantity = this.schedule.declaredQuantity.map(
        (dq: any) =>
          dq.date === date ? { ...dq, quantity: originalQuantity } : dq
      );
      this.getDefaultData();
    }
    this.editingDates.delete(date);
    this.originalQuantities.delete(date);
  }

  approveSchedule(data: any) {
    this.isLoading = true;
    const dataToApprove = {
      ...data,
      updatedBy: this.authService.getCurrentUser()?.name,
      status: 1,
    };

    this.scheduler.updateSchedule(dataToApprove).subscribe({
      next: (response: any) => {
        console.log({ response });
        this.toaster.show({
          title: "Schedule Action",
          message: response.errorMessage || "Action on",
          type: response.errorCode === "0" ? "success" : "error",
        });
      },
      error: (error) => {
        console.log({ error });
        this.toaster.show({
          title: "Schedule Action",
          message: error.errorMessage || "An error occured, Please try again.",
          type: "error",
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.getDefaultData();
      },
    });
  }
}
