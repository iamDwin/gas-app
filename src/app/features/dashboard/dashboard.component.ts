import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { OrganizationService } from "../organizations/organization.service";
import { UserService } from "../users/user.service";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { PendingItemsService } from "../../shared/services/pending-items.service";
import { AuthService } from "../../core/auth/auth.service";
import { LineChartComponent } from "../../shared/components/charts/line-chart/line-chart.component";
import { AreaChartComponent } from "./../../shared/components/charts/area-chart/area-chart.component";
import { BarChartComponent } from "../../shared/components/charts/bar-chart/bar-chart.component";
import { DoughnutChartComponent } from "../../shared/components/charts/doughnut-chart/doughnut-chart.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    LineChartComponent,
    AreaChartComponent,
    BarChartComponent,
    DoughnutChartComponent,
  ],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  organizationsCount = 0;
  usersCount = 0;
  pendingDeclarations = 0;
  pendingAllocations = 0;
  pendingNominations = 0;
  pendingContracts = 0;
  totalPendingCount = 0;
  userType: string = "";

  //  Monthly Declarations Data
  monthlyDeclarations = [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 85, 90];
  monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //  Weekly Declarations Data
  weeklyDeclarations = [28, 35, 42, 30, 25, 38, 40];
  weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  //  Organization Types Data
  orgTypeData = [45, 55];
  orgTypeLabels = ["Upstream", "Downstream"];

  //  Declaration Status Data
  statusData = [35, 15, 10, 40];
  statusLabels = ["Approved", "Pending", "Rejected", "Draft"];

  constructor(
    private organizationService: OrganizationService,
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private pendingItemsService: PendingItemsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.organizationService.getOrganizations().subscribe((orgs) => {
      this.organizationsCount = orgs.length;
    });

    this.userService.getUsers().subscribe((users) => {
      this.usersCount = users.length;
    });

    this.pendingItemsService.pendingDeclarations$.subscribe((count) => {
      this.pendingDeclarations = count;
    });

    this.pendingItemsService.pendingAllocations$.subscribe((count) => {
      this.pendingAllocations = count;
    });

    this.pendingItemsService.pendingNominations$.subscribe((count) => {
      this.pendingNominations = count;
    });

    this.pendingItemsService.pendingContracts$.subscribe((count) => {
      this.pendingContracts = count;
    });

    this.pendingItemsService.getTotalPendingCount().subscribe((count) => {
      this.totalPendingCount = count;
    });

    const user = this.authService.getCurrentUser();
    if (user) this.userType = user.type;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
