import { Component, OnInit, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import {
  BreadcrumbComponent,
  Breadcrumb,
} from "../../shared/components/breadcrumb/breadcrumb.component";
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import {
  ConfirmationModalComponent,
  ConfirmationModalConfig,
} from "../../shared/components/confirmation-modal/confirmation-modal.component";
import { PendingItemsService } from "../../shared/services/pending-items.service";
import { DomSanitizer } from "@angular/platform-browser";
import { OrganizationService } from "../../features/organizations/organization.service";

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  count?: number;
  exact?: boolean;
  allowedTypes?: string[];
}

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    BreadcrumbComponent,
    NotificationsComponent,
    ConfirmationModalComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <div
        class="fixed inset-y-0 left-0 z-[30] transform lg:transform-none lg:opacity-100 duration-200 ease-in-out"
        [class.translate-x-0]="isMobileMenuOpen"
        [class.opacity-100]="isMobileMenuOpen"
        [class.-translate-x-full]="!isMobileMenuOpen"
        [class.opacity-0]="!isMobileMenuOpen"
      >
        <div
          class="bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300"
          [class.w-64]="!isSidebarCollapsed"
          [class.w-20]="isSidebarCollapsed"
        >
          <div
            class="h-16 flex items-center px-6 border-b border-gray-200 justify-between"
          >
            <h1
              class="text-xl font-semibold text-gray-800 transition-opacity duration-300"
              [class.opacity-0]="isSidebarCollapsed"
              [class.w-0]="isSidebarCollapsed"
              [class.overflow-hidden]="isSidebarCollapsed"
            >
              Dashboard
            </h1>
            <button
              (click)="toggleSidebar()"
              class="hover:bg-gradient-to-b hover:from-[#DCFAE6] hover:to-[#ABEFC6] rounded-lg p-2 hover:border-[#71d8a1] hover:border"
            >
              <svg
                class="h-5 w-5 transform transition-transform duration-300"
                [class.rotate-180]="isSidebarCollapsed"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />

                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  [class.rotate-180]="isSidebarCollapsed"
                  class="h-5 w-5 transform transition-transform duration-300"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  ></path>
                </svg>
              </svg>
            </button>
          </div>

          <!-- User Profile -->
          <div class="px-6 py-3 border-b border-gray-200">
            <div
              class="flex items-center"
              [class.justify-center]="isSidebarCollapsed"
            >
              <div
                class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium"
              >
                {{ userInitial }}
              </div>
              <div
                class="ml-3 transition-opacity duration-300"
                *ngIf="!isSidebarCollapsed"
              >
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">{{ userEmail }}</p>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            <!-- Filtered Menu Items -->
            <ng-container *ngFor="let item of filteredMenuItems">
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-primary/10 text-primary border-primary"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="flex items-center px-3 py-3 text-sm font-medium text-gray-900 rounded-md hover:bg-primary/10 hover:text-primary group border-l-2 border-transparent"
                [class.justify-center]="isSidebarCollapsed"
              >
                <span
                  [innerHTML]="sanitizer.bypassSecurityTrustHtml(item.icon)"
                  class="flex-shrink-0"
                ></span>
                <span
                  class="ml-3 transition-opacity duration-300"
                  [class.opacity-0]="isSidebarCollapsed"
                  [class.w-0]="isSidebarCollapsed"
                  [class.overflow-hidden]="isSidebarCollapsed"
                >
                  {{ item.label }}
                </span>
                <span
                  *ngIf="item.count && item.count > 0"
                  class="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full"
                  [class.opacity-0]="isSidebarCollapsed"
                >
                  {{ item.count }}
                </span>
              </a>
            </ng-container>

            <button
              (click)="showLogoutConfirmation()"
              class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-red-50 hover:text-red-600 group mt-auto"
              [class.justify-center]="isSidebarCollapsed"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span
                class="ml-3 transition-opacity duration-300"
                [class.opacity-0]="isSidebarCollapsed"
                [class.w-0]="isSidebarCollapsed"
                [class.overflow-hidden]="isSidebarCollapsed"
              >
                Sign out
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Mobile menu button -->
      <div
        class="lg:hidden fixed top-0 left-0 p-4 z-[31]"
        *ngIf="!isMobileMenuOpen"
      >
        <button
          (click)="toggleMobileMenu()"
          class="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
        >
          <span class="sr-only">Open sidebar</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <!-- Overlay -->
      <div
        *ngIf="isMobileMenuOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 z-[29] lg:hidden"
        (click)="toggleMobileMenu()"
      ></div>

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col transition-all duration-300"
        [class.lg:ml-64]="!isSidebarCollapsed"
        [class.lg:ml-20]="isSidebarCollapsed"
      >
        <!-- Top Navigation -->
        <header
          class="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center fixed top-0 right-0 left-0 z-20 transition-all duration-300"
          [class.lg:left-64]="!isSidebarCollapsed"
          [class.lg:left-20]="isSidebarCollapsed"
        >
          <div class="px-4 flex-1 flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-16 lg:hidden"></div>
              <app-breadcrumb [items]="breadcrumbs"></app-breadcrumb>
            </div>
            <app-notifications></app-notifications>
          </div>
        </header>

        <main class="flex-1 mt-16">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <app-confirmation-modal
      [show]="showLogoutModal"
      [config]="logoutModalConfig"
      (onConfirm)="confirmLogout()"
      (onCancel)="cancelLogout()"
    ></app-confirmation-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      input,
      select,
      textarea {
        min-height: 44px;
      }

      :host ::ng-deep svg {
        width: 20px;
        height: 20px;
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  isMobileMenuOpen = false;
  isSidebarCollapsed = false;
  breadcrumbs: Breadcrumb[] = [{ label: "Dashboard", link: "/dashboard" }];
  showLogoutModal = false;
  userName = "";
  userEmail = "";
  userInitial = "";
  userType = "";

  menuItems: MenuItem[] = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>`,
      exact: true,
      allowedTypes: ["M", "U", "D"],
    },
    {
      path: "/organizations",
      label: "Organizations",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>`,
      allowedTypes: ["M"],
    },
    {
      path: "/users",
      label: "Users",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>`,
      allowedTypes: ["M", "U", "D"],
    },
    {
      path: "/declarations",
      label: "Declarations",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
      allowedTypes: ["M", "U"],
    },
    {
      path: "/nominations",
      label: "Nominations",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>`,
      allowedTypes: ["M", "D"],
    },
    {
      path: "/reports",
      label: "Reports",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
      allowedTypes: ["M", "U", "D"],
    },
  ];

  logoutModalConfig: ConfirmationModalConfig = {
    title: "Sign Out",
    message:
      "Are you sure you want to sign out? You will need to sign in again to access the application.",
    confirmText: "Sign Out",
    cancelText: "Cancel",
    type: "warning",
  };

  constructor(
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private pendingItemsService: PendingItemsService,
    private organizationService: OrganizationService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs.length
        ? breadcrumbs
        : [{ label: "Dashboard", link: "/dashboard" }];
    });

    // Update menu item counts
    this.pendingItemsService.pendingDeclarations$.subscribe((count) => {
      this.updateMenuItemCount("declarations", count);
    });

    this.pendingItemsService.pendingNominations$.subscribe((count) => {
      this.updateMenuItemCount("nominations", count);
    });

    // Update user info
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.userEmail = user.email;
      this.userInitial = user.name.charAt(0).toUpperCase();
      this.userType = user.organizationType || "M"; // Default to M if not set
    }

    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = user.name;
        this.userEmail = user.email;
        this.userInitial = user.name.charAt(0).toUpperCase();
        this.userType = user.organizationType || "M";
      }
    });
  }

  get filteredMenuItems(): MenuItem[] {
    return this.menuItems.filter(
      (item) => item.allowedTypes?.includes(this.userType)
    );
  }

  updateMenuItemCount(path: string, count: number) {
    const item = this.menuItems.find((item) => item.path.includes(path));
    if (item) {
      item.count = count;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  showLogoutConfirmation() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.logout();
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}