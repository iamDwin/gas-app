import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  DataTableComponent,
  TableAction,
} from "../../shared/components/data-table/data-table.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { AuthService } from "../../core/auth/auth.service";
import { FormsModule } from "@angular/forms";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { ScheduleService } from "./schedule.service";

@Component({
  selector: "app-schedule",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    ButtonComponent,
    LoadingComponent,
  ],
  templateUrl: "./schedule.component.html",
})
export class ScheduleComponent implements OnInit {
  filterDate: string = "";
  defaultDate = new Date().toLocaleDateString("en-CA");
  isLoading = false;

  scheduleColumn = [
    { prop: "requestId", name: "#" },
    { prop: "institutionCode", name: "# Code" },
    { prop: "institutionName", name: "Institution" },
    { prop: "declaredQuantity", name: "DCV (MMscf)" },
    { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "View Details",
      type: "primary",
    },
    {
      label: "Approve",
      type: "success",
    },
    // {
    //   label: "Edit",
    //   type: "primary",
    //   isDisabled: (row: Declaration) => row.status !== "draft",
    // },
    // {
    //   label: "Delete",
    //   type: "danger",
    //   isDisabled: (row: Declaration) => row.status !== "draft",
    // },
  ];

  simulatedData = [
    {
      id: 1,
      requestId: "REQ001",
      declaredQuantity: 100,
      date: "2025-05-27",
      type: "Type A",
      declaredBy: "User1",
      declaredByName: "John Doe",
      institutionCode: "INST001",
      institutionName: "Institution One",
      createdAt: "2025-05-27T16:31:30.113Z",
      status: 1,
    },
    {
      id: 2,
      requestId: "REQ002",
      declaredQuantity: 200,
      date: "2025-05-28",
      type: "Type B",
      declaredBy: "User2",
      declaredByName: "Jane Smith",
      institutionCode: "INST002",
      institutionName: "Institution Two",
      createdAt: "2025-05-28T10:15:45.113Z",
      status: 2,
    },
    {
      id: 3,
      requestId: "REQ003",
      declaredQuantity: 150,
      date: "2025-05-29",
      type: "Type C",
      declaredBy: "User3",
      declaredByName: "Alice Johnson",
      institutionCode: "INST003",
      institutionName: "Institution Three",
      createdAt: "2025-05-29T08:45:30.113Z",
      status: 0,
    },
    {
      id: 4,
      requestId: "REQ004",
      declaredQuantity: 250,
      date: "2025-05-30",
      type: "Type D",
      declaredBy: "User4",
      declaredByName: "Bob Brown",
      institutionCode: "INST004",
      institutionName: "Institution Four",
      createdAt: "2025-05-30T14:20:10.113Z",
      status: 1,
    },
    {
      id: 5,
      requestId: "REQ005",
      declaredQuantity: 300,
      date: "2025-05-31",
      type: "Type E",
      declaredBy: "User5",
      declaredByName: "Charlie Green",
      institutionCode: "INST005",
      institutionName: "Institution Five",
      createdAt: "2025-05-31T12:00:00.113Z",
      status: 2,
    },
  ];

  constructor(
    private authService: AuthService,
    private scheduler: ScheduleService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Schedule", link: "/schedule" },
    ]);
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
        console.log({ response });
        this.isLoading = false;
      },
      error: (error) => {
        console.log({ error });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
