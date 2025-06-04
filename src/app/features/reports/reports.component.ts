import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import {
  DataTableComponent,
  TableAction,
} from "../../shared/components/data-table/data-table.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { AuthService } from "../../core/auth/auth.service";
import { Declaration } from "../declarations/declaration.model";
import { ReportService } from "./report.service";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { ToastService } from "../../shared/services/toast.service";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: "./reports.component.html",
})
export class ReportsComponent implements OnInit {
  userType: string = "";
  tabs = [
    {
      id: "daily",
      label: "Daily Reports",
      showFor: ["U", "D", "M", "G"],
      disabled: false,
    },
    {
      id: "declarations",
      label: "Declaration Reports",
      showFor: ["U", "M", "G"],
      disabled: false,
    },
    {
      id: "nominations",
      label: "Nomination Reports",
      showFor: ["D", "M", "G"],
      disabled: false,
    },
    {
      id: "schedule",
      label: "Schedule Reports",
      showFor: ["U", "D", "M", "G"],
      disabled: false,
    },
  ];

  get shouldShowViewDetails(): boolean {
    return this.activeTab !== "daily";
  }

  actions: TableAction[] = [
    {
      label: "Download Report",
      type: "success",
      isDisabled: (row: any) => {
        return this.activeTab === "daily";
      },
    },
    {
      label: "View Details",
      type: "primary",
      isDisabled: (row: any) => {
        return this.activeTab === "daily";
      },
    },
  ];

  activeTab: string = "";
  startDate: string = "";
  endDate: string = "";
  tempStartDate: string = "";
  tempEndDate: string = "";
  isLoading = false;
  isloadingMessage = "Loading";

  // Sample data structure for each report type

  dailyColumns = [
    { prop: "institutionName", name: "Institution" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "type", name: "Institution Type" },
    { prop: "date", name: "Date" },
    // { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  declarationColumns = [
    { prop: "institutionName", name: "Institution" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "currentAgreedDcv", name: "Declared DCV (MMscf)" },
    { prop: "type", name: "Institution Type" },
    { prop: "periodStartDate", name: "From" },
    { prop: "periodEndDate", name: "To" },
    // { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  nominationColumns = [
    { prop: "institutionName", name: "Institution" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "currentAgreedDcv", name: "Nominated DCV (MMscf)" },
    { prop: "type", name: "Institution Type" },
    { prop: "periodStartDate", name: "From" },
    { prop: "periodEndDate", name: "To" },
    // { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  scheduleColumns = [
    { prop: "date", name: "Date" },
    { prop: "institution", name: "Institution" },
    { prop: "type", name: "Type" },
    { prop: "time", name: "Time" },
    // { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  // Sample data
  declarationData: any[] = [];
  nominationData: any[] = [];
  dailyData: any[] = [];
  scheduleData: any[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private authService: AuthService,
    private reportService: ReportService,
    private router: Router,
    private toaster: ToastService
  ) {
    // Set default dates to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.startDate = firstDay.toISOString().split("T")[0];
    this.endDate = lastDay.toISOString().split("T")[0];
    this.tempStartDate = this.startDate;
    this.tempEndDate = this.endDate;

    // Get user type
    const user = this.authService.getCurrentUser();
    this.userType = user?.type || "";

    // Set initial active tab based on user type
    this.setInitialActiveTab();
  }

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Reports", link: "/reports" },
    ]);
    this.loadData();
  }

  get visibleTabs() {
    return this.tabs.filter((tab) => tab.showFor.includes(this.userType));
  }

  setInitialActiveTab() {
    const visibleTabs = this.visibleTabs;
    if (visibleTabs.length > 0) {
      this.activeTab = visibleTabs[0].id;
    }
  }

  get currentColumns() {
    switch (this.activeTab) {
      case "daily":
        return this.dailyColumns;
      case "nominations":
        return this.nominationColumns;
      case "schedule":
        return this.scheduleColumns;
      default:
        return this.declarationColumns;
    }
  }

  get currentData() {
    switch (this.activeTab) {
      case "daily":
        return this.dailyData;
      case "nominations":
        return this.nominationData;
      case "schedule":
        return this.scheduleData;
      default:
        return this.declarationData;
    }
  }

  get isDateRangeValid(): boolean {
    return (
      !!this.tempStartDate &&
      !!this.tempEndDate &&
      new Date(this.tempStartDate) <= new Date(this.tempEndDate)
    );
  }

  switchTab(tabId: string) {
    this.activeTab = tabId;
    this.loadData();
  }

  getTabPosition(): string {
    const index = this.visibleTabs.findIndex(
      (tab) => tab.id === this.activeTab
    );
    return `${index * 100}%`;
  }

  getTabWidth(): string {
    return `${100 / this.visibleTabs.length}%`;
  }

  getCurrentTabLabel(): string {
    return this.tabs.find((tab) => tab.id === this.activeTab)?.label || "";
  }

  applyDateFilter() {
    if (this.isDateRangeValid) {
      this.startDate = this.tempEndDate;
      // this.endDate = this.tempEndDate;
      this.loadData();
    }
  }

  getActions(): TableAction[] {
    switch (this.activeTab) {
      case "daily":
        return [
          {
            label: "Download Report",
            type: "success",
          },
        ];
      case "declarations":
        return [
          {
            label: "View Details",
            type: "primary",
          },
          {
            label: "Download Report",
            type: "success",
          },
        ];
      case "nominations":
        return [
          {
            label: "View Details",
            type: "primary",
          },
          {
            label: "Download Report",
            type: "success",
          },
        ];
      case "schedule":
        return [
          {
            label: "View Details",
            type: "primary",
          },
          {
            label: "Download Report",
            type: "success",
          },
        ];
      default:
        return [];
    }
  }

  loadData() {
    this.isLoading = true;
    switch (this.activeTab) {
      case "daily":
        this.reportService.getDailyReport(this.startDate).subscribe({
          next: (data: any) => {
            console.log({ data });
            this.dailyData = data;
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error("Error loading declaration reports:", error);
            this.isLoading = false;
          },
        });
        break;

      case "declarations":
        this.reportService.getApprovadDeclarations().subscribe({
          next: (data: any) => {
            this.declarationData = data;
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error("Error loading declaration reports:", error);
            this.isLoading = false;
          },
        });
        break;

      case "nominations":
        this.reportService.getApprovadNomination().subscribe({
          next: (data: any) => {
            this.nominationData = data;
            this.isLoading = false;
          },
          error: (error) => {
            console.error("Error loading nomination reports:", error);
            this.isLoading = false;
          },
        });
        break;

      case "schedule":
        this.reportService.getApprovadSchedules().subscribe({
          next: (data: any) => {
            this.nominationData = data;
            this.isLoading = false;
          },
          error: (error) => {
            console.error("Error loading nomination reports:", error);
            this.isLoading = false;
          },
        });
        break;
    }
  }

  onActionClick(event: { action: TableAction; row: Declaration }) {
    console.log("Action clicked:", event.action.label);
    switch (event.action.label) {
      case "View Details":
        this.router.navigate(["/reports", event.row.requestId]);
        break;
      case "Download Report":
        this.downloadReport(event.row);
        break;
      default:
        console.warn("Unknown action:", event.action.label);
    }
  }

  downloadReport(data: any) {
    this.isLoading = true;
    this.isloadingMessage = "Downloading Report";
    const requestId = data.declarationId;
    this.reportService.downloadReport2(requestId).subscribe({
      next: (response) => {
        console.log(response);
        this.downLoadFile(response, "declaration");
        this.toaster.show({
          title: "Download Report",
          message: "Report generated and downloaded successfully",
          type: "success",
        });
      },
      error: (error) => {
        this.toaster.show({
          title: "Download Error",
          message: "Failed to download the report",
          type: "error",
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, product: any) {
    let binaryData = [];
    binaryData.push(data);
    let downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(
      new Blob([data], {
        type: "application/pdf",
      })
    );
    downloadLink.setAttribute(
      "download",
      product + "_" + new Date().toLocaleString()
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
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
}
