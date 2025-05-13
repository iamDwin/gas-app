import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { OrganizationService } from "../organizations/organization.service";
import { UserService } from "../users/user.service";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { PendingItemsService } from "../../shared/services/pending-items.service";
import { AuthService } from "../../core/auth/auth.service";

interface DashboardCard {
  title: string;
  path: string;
  icon: string;
  count: number;
  allowedTypes: string[];
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Filtered Dashboard Cards -->
        <ng-container *ngFor="let card of filteredDashboardCards">
          <div
            (click)="navigate(card.path)"
            class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <div class="flex items-center mb-4">
              <div
                class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3"
              >
                <span [innerHTML]="sanitizedIcon(card.icon)"></span>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ card.title }}
              </h2>
            </div>
            <div class="flex items-baseline">
              <p class="text-4xl font-bold text-primary">
                {{ card.count }}
              </p>
              <p class="ml-2 text-gray-600">total</p>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  userType = "M"; // Default to M
  organizationsCount = 0;
  usersCount = 0;
  pendingDeclarations = 0;
  pendingNominations = 0;

  dashboardCards: DashboardCard[] = [
    {
      title: "Organizations",
      path: "/organizations",
      icon: `<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>`,
      count: 0,
      allowedTypes: ["M"],
    },
    {
      title: "Users",
      path: "/users",
      icon: `<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>`,
      count: 0,
      allowedTypes: ["M", "U", "D"],
    },
    {
      title: "Declarations",
      path: "/declarations",
      icon: `<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
      count: 0,
      allowedTypes: ["M", "U"],
    },
    {
      title: "Nominations",
      path: "/nominations",
      icon: `<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>`,
      count: 0,
      allowedTypes: ["M", "D"],
    },
    {
      title: "Reports",
      path: "/reports",
      icon: `<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
      count: 0,
      allowedTypes: ["M", "U", "D"],
    },
  ];

  constructor(
    private organizationService: OrganizationService,
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private pendingItemsService: PendingItemsService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userType = user.organizationType || "M";
    }
  }

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Dashboard", link: "/dashboard" },
    ]);

    this.loadData();

    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userType = user.organizationType || "M";
      }
    });
  }

  get filteredDashboardCards(): DashboardCard[] {
    return this.dashboardCards.filter((card) =>
      card.allowedTypes.includes(this.userType)
    );
  }

  loadData() {
    this.organizationService.getOrganizations().subscribe((orgs) => {
      this.organizationsCount = orgs.length;
      this.updateCardCount("Organizations", this.organizationsCount);
    });

    this.userService.getUsers().subscribe((users) => {
      this.usersCount = users.length;
      this.updateCardCount("Users", this.usersCount);
    });

    this.pendingItemsService.pendingDeclarations$.subscribe((count) => {
      this.pendingDeclarations = count;
      this.updateCardCount("Declarations", count);
    });

    this.pendingItemsService.pendingNominations$.subscribe((count) => {
      this.pendingNominations = count;
      this.updateCardCount("Nominations", count);
    });
  }

  updateCardCount(title: string, count: number) {
    const card = this.dashboardCards.find((c) => c.title === title);
    if (card) {
      card.count = count;
    }
  }

  sanitizedIcon(icon: string): string {
    return icon;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}