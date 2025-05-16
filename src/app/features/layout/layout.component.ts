import { Component, OnInit } from "@angular/core";
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
  templateUrl: "./layout.component.html", // Assuming you have a separate HTML file
})
export class LayoutComponent implements OnInit {
  isMobileMenuOpen = false;
  isSidebarCollapsed = false;
  isOrganizationsMenuOpen = false;
  isUsersMenuOpen = false;
  isDeclarationsMenuOpen = false;
  isNominationsMenuOpen = false;
  breadcrumbs: Breadcrumb[] = [{ label: "Dashboard", link: "/dashboard" }];
  showLogoutModal = false;
  pendingOrganizations = 0;
  userName = "";
  fullName = "";
  userEmail = "";
  userInitial = "";
  institutionName = "";
  institutionType: string = "";
  openMenus: { [key: string]: boolean } = {};

  menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>`,
      exact: true,
    },
    {
      path: "/declarations",
      label: "Declarations",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
      count: 0,
      children: [
        { path: "/declarations", label: "All Declarations" },
        { path: "/declarations/pending", label: "Pending Approvals" },
      ],
    },
    {
      path: "/nominations",
      label: "Nominations",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>`,
      count: 0,
      children: [
        { path: "/nominations", label: "All Nominations" },
        // { path: "/nominations/pending", label: "Pending Nominations" },
      ],
    },
    {
      path: "/organizations",
      label: "Institutions",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>`,
      children: [
        { path: "/organizations", label: "All Institutions" },
        { path: "/organizations/pending", label: "Pending Approvals" },
      ],
    },
    {
      path: "/users",
      label: "Users",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>`,
      children: [
        { path: "/users", label: "All Users" },
        { path: "/users/pending", label: "Pending Approvals" },
      ],
    },

    // {
    //   path: "/pending-approvals",
    //   label: "Pending Approvals",
    //   icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    //   </svg>`,
    //   count: 0,
    // },
    {
      path: "/reports",
      label: "Reports",
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
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

    // this.pendingItemsService.pendingContracts$.subscribe((count) => {
    //   this.updateMenuItemCount("contracts", count);
    // });

    // this.pendingItemsService.getTotalPendingCount().subscribe((count) => {
    //   this.updateMenuItemCount("pending-approvals", count);
    // });

    // Update pending organizations count
    this.organizationService
      .getPendingOrganizations()
      .subscribe((organizations) => {
        this.pendingOrganizations = organizations.length;
      });

    // Update user info
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.fullName = user.fullName;
      this.userEmail = user.email;
      this.userInitial = user.name.charAt(0).toUpperCase();
      this.institutionType = user.type;
      this.institutionName = user.organizationName;
    }

    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = user.name;
        this.fullName = user.fullName;
        this.userEmail = user.email;
        this.userInitial = user.name.charAt(0).toUpperCase();
        this.institutionType = user.type;
        this.institutionName = user.organizationName;
      }
    });
  }

  getFilteredMenuItems() {
    // Filter menu items based on institutionType
    switch (this.institutionType) {
      case "M":
        return this.menuItems; // Show all items except allocations, which are already removed
      case "U":
        return this.menuItems.filter((item) =>
          ["/dashboard", "/users", "/declarations", "/reports"].includes(
            item.path
          )
        );
      case "D":
        return this.menuItems.filter((item) =>
          ["/dashboard", "/users", "/nominations", "/reports"].includes(
            item.path
          )
        );
      default:
        return this.menuItems; // Default to showing all items except allocations
    }
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
    if (this.isSidebarCollapsed) {
      this.isOrganizationsMenuOpen = false;
    }
  }

  toggleOrganizationsMenu() {
    if (!this.isSidebarCollapsed) {
      this.isOrganizationsMenuOpen = !this.isOrganizationsMenuOpen;
    }
  }

  toggleUsersMenu() {
    if (!this.isSidebarCollapsed) {
      this.isUsersMenuOpen = !this.isUsersMenuOpen;
    }
  }

  toggleDeclarationsMenu() {
    if (!this.isSidebarCollapsed) {
      this.isDeclarationsMenuOpen = !this.isDeclarationsMenuOpen;
    }
  }

  // toggleAllocationsMenu() {
  //   if (!this.isSidebarCollapsed) {
  //     this.isAllocationsMenuOpen = !this.isAllocationsMenuOpen;
  //   }
  // }

  toggleNominationsMenu() {
    if (!this.isSidebarCollapsed) {
      this.isNominationsMenuOpen = !this.isNominationsMenuOpen;
    }
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

  toggleMenu(path: string) {
    this.openMenus[path] = !this.openMenus[path];
  }

  isMenuOpen(path: string): boolean {
    return this.openMenus[path] || false;
  }
}
