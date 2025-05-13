import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { OrganizationService } from "../organizations/organization.service";
import { UserService } from "../users/user.service";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { PendingItemsService } from "../../shared/services/pending-items.service";
import { AuthService } from "../../core/auth/auth.service";
import { LineChartComponent } from "../../shared/components/charts/line-chart/line-chart.component";
import { BarChartComponent } from "../../shared/components/charts/bar-chart/bar-chart.component";
import { DoughnutChartComponent } from "../../shared/components/charts/doughnut-chart/doughnut-chart.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    // LineChartComponent,
    // BarChartComponent,
    // DoughnutChartComponent,
  ],
  template: `
    <div class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Organizations Card -->
        <div
          *ngIf="userType == 'M'"
          (click)="navigate('/organizations')"
          class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          <div class="flex items-center mb-4">
            <div
              class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Organizations</h2>
          </div>
          <div class="flex items-baseline">
            <p class="text-4xl font-bold text-primary">
              {{ organizationsCount }}
            </p>
            <p class="ml-2 text-gray-600">total</p>
          </div>
        </div>

        <!-- Users Card -->
        <div
          (click)="navigate('/users')"
          class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          <div class="flex items-center mb-4">
            <div
              class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Users</h2>
          </div>
          <div class="flex items-baseline">
            <p class="text-4xl font-bold text-primary">{{ usersCount }}</p>
            <p class="ml-2 text-gray-600">total</p>
          </div>
        </div>

        <!-- Declarations Card -->
        <div
          *ngIf="userType == 'U' || userType == 'M'"
          (click)="navigate('/declarations')"
          class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          <div class="flex items-center mb-4">
            <div
              class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Declarations</h2>
          </div>
          <div class="flex items-baseline">
            <p class="text-4xl font-bold text-primary">
              {{ pendingDeclarations }}
            </p>
            <p class="ml-2 text-gray-600">pending</p>
          </div>
        </div>

        <!-- Nominations Card -->
        <div
          *ngIf="userType == 'D' || userType == 'M'"
          (click)="navigate('/nominations')"
          class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          <div class="flex items-center mb-4">
            <div
              class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Nominations</h2>
          </div>
          <div class="flex items-baseline">
            <p class="text-4xl font-bold text-primary">
              {{ pendingNominations }}
            </p>
            <p class="ml-2 text-gray-600">pending</p>
          </div>
        </div>

        <!-- Reports Card -->
        <div
          (click)="navigate('/reports')"
          class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          <div class="flex items-center mb-4">
            <div
              class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Reports</h2>
          </div>
          <div class="flex items-baseline">
            <!-- <p class="text-4xl font-bold text-primary">0</p> -->
            <p class="ml-2 text-gray-600">total</p>
          </div>
        </div>
        <!-- </div> -->

        <!-- Weekly Declarations Bar Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Weekly Declarations
          </h3>
          <div class="h-80">
            <!-- <app-bar-chart
              [data]="weeklyDeclarations"
              [labels]="weekLabels"
              label="Declarations"
            ></app-bar-chart> -->
          </div>
        </div>

        <!-- Approval Status Distribution -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Declaration Status
          </h3>
          <div class="h-80">
            <!-- <app-doughnut-chart
              [data]="statusData"
              [labels]="statusLabels"
              [backgroundColor]="['#079455', '#eab308', '#ef4444', '#3b82f6']"
            ></app-doughnut-chart> -->
          </div>
        </div>
      </div>
    </div>
  `,
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

  // Monthly Declarations Data
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

  // Weekly Declarations Data
  weeklyDeclarations = [28, 35, 42, 30, 25, 38, 40];
  weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Organization Types Data
  orgTypeData = [45, 55];
  orgTypeLabels = ["Upstream", "Downstream"];

  // Declaration Status Data
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
