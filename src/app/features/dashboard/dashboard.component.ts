import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { OrganizationService } from "../organizations/organization.service";
import { UserService } from "../users/user.service";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { PendingItemsService } from "../../shared/services/pending-items.service";
import { AuthService } from "../../core/auth/auth.service";
// import { LineChartComponent } from "../../shared/components/charts/line-chart/line-chart.component";
// import { BarChartComponent } from "../../shared/components/charts/bar-chart/bar-chart.component";
// import { DoughnutChartComponent } from "../../shared/components/charts/doughnut-chart/doughnut-chart.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <!-- System Status Bar -->
      <div class="bg-primary rounded-xl shadow border-primary-dark mb-4">
        <div class="grid grid-cols-4 divide-x-2 divide-white/100">
          <!-- System Health -->
          <div class="p-4 flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p class="text-white/80 text-sm">System Health</p>
              <p class="text-white text-lg font-semibold">Excellent</p>
            </div>
          </div>

          <!-- Database Health -->
          <div class="p-4 flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
            </div>
            <div>
              <p class="text-white/80 text-sm">Database Status</p>
              <p class="text-white text-lg font-semibold">Healthy</p>
            </div>
          </div>

          <!-- API Status -->
          <div class="p-4 flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p class="text-white/80 text-sm">API Status</p>
              <p class="text-white text-lg font-semibold">Operational</p>
            </div>
          </div>

          <!-- System Load -->
          <div class="p-4 flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p class="text-white/80 text-sm">System Load</p>
              <p class="text-white text-lg font-semibold">10%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        [ngClass]="{
          'lg:grid-cols-4': userType === 'M',
          'lg:grid-cols-3': userType !== 'M'
        }"
      >
        <!-- Organizations Card -->
        <div
          *ngIf="userType == 'M'"
          (click)="navigate('/organizations')"
          class="bg-white rounded-xl shadow p-6 cursor-pointer"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-emerald-600"
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
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-600">Organizations</h2>
                <p class="text-2xl font-bold text-gray-900">
                  {{ organizationsCount }}
                </p>
              </div>
            </div>
            <div class="flex items-center text-emerald-600">
              <span class="text-sm font-medium">+12.5%</span>
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500">Overall Total</p>
        </div>

        <!-- Users Card -->
        <div
          (click)="navigate('/users')"
          class="bg-white rounded-xl shadow p-6 cursor-pointer"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-blue-600"
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
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-600">Users</h2>
                <p class="text-2xl font-bold text-gray-900">{{ usersCount }}</p>
              </div>
            </div>
            <div class="flex items-center text-red-600">
              <span class="text-sm font-medium">-1.5%</span>
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500">Overall Total</p>
        </div>

        <!-- Declarations Card -->
        <div
          *ngIf="userType == 'U' || userType == 'M'"
          (click)="navigate('/declarations')"
          class="bg-white rounded-xl shadow p-6 cursor-pointer"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-purple-600"
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
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-600">Declarations</h2>
                <p class="text-2xl font-bold text-gray-900">
                  {{ pendingDeclarations }}
                </p>
              </div>
            </div>
            <div class="flex items-center text-emerald-600">
              <span class="text-sm font-medium">+4.5%</span>
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500">Overall Total</p>
        </div>

        <!-- Nominations Card -->
        <div
          *ngIf="userType == 'D' || userType == 'M'"
          (click)="navigate('/nominations')"
          class="bg-white rounded-xl shadow p-6 cursor-pointer"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-amber-600"
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
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-600">Nominations</h2>
                <p class="text-2xl font-bold text-gray-900">
                  {{ pendingNominations }}
                </p>
              </div>
            </div>
            <div class="flex items-center text-emerald-600">
              <span class="text-sm font-medium">+8.3%</span>
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500">Overall Total</p>
        </div>

        <!-- Reports Card -->
        <div
          *ngIf="userType == 'U' || userType == 'D'"
          (click)="navigate('/reports')"
          class="bg-white rounded-xl shadow p-6 cursor-pointer"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-amber-600"
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
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-600">Nominations</h2>
                <p class="text-2xl font-bold text-gray-900">
                  {{ pendingNominations }}
                </p>
              </div>
            </div>
            <div class="flex items-center text-emerald-600">
              <span class="text-sm font-medium">+8.3%</span>
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500">Overall Total</p>
        </div>
      </div>

      <!-- Monthly Statistics Bar -->
      <div class="bg-white rounded-xl shadow mb-4">
        <div class="p-4 border-b-2 border-primary-dark">
          <h2 class="text-lg font-semibold text-primary">Monthly Statistics</h2>
        </div>
        <div class="grid grid-cols-4 divide-x-2 divide-primary-dark">
          <div class="p-4 flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p class="text-primary/70 text-sm">Total</p>
              <p class="text-primary text-lg font-semibold">245</p>
            </div>
          </div>

          <div class="p-4 flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-primary/70 text-sm">Approved</p>
              <p class="text-primary text-lg font-semibold">180</p>
            </div>
          </div>

          <div class="p-4 flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-primary/70 text-sm">Pending</p>
              <p class="text-primary text-lg font-semibold">45</p>
            </div>
          </div>

          <div class="p-4 flex items-center">
            <div
              class="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-primary/70 text-sm">Rejected</p>
              <p class="text-primary text-lg font-semibold">20</p>
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="userType == 'U' || userType == 'M'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4"
      >
        <!-- Weekly Declarations Bar Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Monthly Declarations chart
          </h3>
          <div class="h-fit">
            <h1
              class="flex my-20 items-center justify-center text-[#079455] opacity-0.8 text-4xl font-bold"
            >
              Coming Soon!
            </h1>
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
            Declaration Status charts
          </h3>
          <div class="h-fit">
            <h1
              class="flex my-20 items-center justify-center text-[#079455] opacity-0.8 text-4xl font-bold"
            >
              Coming Soon!
            </h1>
            <!-- <app-doughnut-chart
               [data]="statusData"
               [labels]="statusLabels"
               [backgroundColor]="['#079455', '#eab308', '#ef4444', '#3b82f6']"
             ></app-doughnut-chart> -->
          </div>
        </div>
      </div>

      <div
        *ngIf="userType == 'D' || userType == 'M'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4"
      >
        <!-- Weekly Nomination Bar Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Monthly Nomination chart
          </h3>
          <div class="h-fit">
            <h1
              class="flex my-20 items-center justify-center text-[#079455] opacity-0.8 text-4xl font-bold"
            >
              Coming Soon!
            </h1>
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
            Nomination Status chart
          </h3>
          <div class="h-fit">
            <h1
              class="flex my-20 items-center justify-center text-[#079455] opacity-0.8 text-4xl font-bold"
            >
              Coming Soon!
            </h1>
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
