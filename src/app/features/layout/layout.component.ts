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
import { AnnouncementBarComponent } from "../../shared/components/announcement/announcement.component";

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
    AnnouncementBarComponent,
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
  showAnnouncement = true;

  menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.6753 13.2421C17.1452 14.4959 16.316 15.6006 15.2602 16.4599C14.2045 17.3191 12.9543 17.9067 11.619 18.1711C10.2837 18.4356 8.90401 18.3689 7.60045 17.977C6.29688 17.585 5.10918 16.8797 4.14118 15.9227C3.17317 14.9657 2.45434 13.7861 2.04752 12.4871C1.64071 11.1881 1.55829 9.8092 1.80749 8.47099C2.05669 7.13278 2.62991 5.87599 3.47703 4.81049C4.32416 3.74499 5.41939 2.90323 6.66699 2.3588M17.6993 6.81144C18.0329 7.61682 18.2376 8.46827 18.307 9.3345C18.3242 9.5485 18.3327 9.6555 18.2902 9.75188C18.2548 9.8324 18.1844 9.90859 18.107 9.9504C18.0143 10.0005 17.8985 10.0005 17.667 10.0005H10.667C10.4336 10.0005 10.317 10.0005 10.2278 9.95505C10.1494 9.9151 10.0857 9.85136 10.0457 9.77296C10.0003 9.68383 10.0003 9.56715 10.0003 9.3338V2.3338C10.0003 2.10224 10.0003 1.98646 10.0504 1.89378C10.0922 1.81636 10.1684 1.74604 10.2489 1.71054C10.3453 1.66805 10.4523 1.67663 10.6663 1.69378C11.5325 1.76323 12.384 1.96787 13.1894 2.30147C14.2004 2.72026 15.1191 3.33409 15.8929 4.10791C16.6667 4.88173 17.2805 5.80039 17.6993 6.81144Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
      exact: true,
    },
    {
      path: "/declarations",
      label: "Declarations",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6667 9.16699H6.66667M8.33333 12.5003H6.66667M13.3333 5.83366H6.66667M16.6667 5.66699V14.3337C16.6667 15.7338 16.6667 16.4339 16.3942 16.9686C16.1545 17.439 15.772 17.8215 15.3016 18.0612C14.7669 18.3337 14.0668 18.3337 12.6667 18.3337H7.33333C5.9332 18.3337 5.23314 18.3337 4.69836 18.0612C4.22795 17.8215 3.8455 17.439 3.60582 16.9686C3.33333 16.4339 3.33333 15.7338 3.33333 14.3337V5.66699C3.33333 4.26686 3.33333 3.5668 3.60582 3.03202C3.8455 2.56161 4.22795 2.17916 4.69836 1.93948C5.23314 1.66699 5.9332 1.66699 7.33333 1.66699H12.6667C14.0668 1.66699 14.7669 1.66699 15.3016 1.93948C15.772 2.17916 16.1545 2.56161 16.3942 3.03202C16.6667 3.5668 16.6667 4.26686 16.6667 5.66699Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
      count: 0,
      children: [
        { path: "/declarations", label: "Approved Declarations" },
        { path: "/declarations/pending", label: "Pending Declarations" },
        { path: "/declarations/declined", label: "Declined Declarations" },
      ],
    },
    {
      path: "/nominations",
      label: "Nominations",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.6667 10.417V5.66699C16.6667 4.26686 16.6667 3.5668 16.3942 3.03202C16.1545 2.56161 15.772 2.17916 15.3016 1.93948C14.7669 1.66699 14.0668 1.66699 12.6667 1.66699H7.33333C5.9332 1.66699 5.23314 1.66699 4.69836 1.93948C4.22795 2.17916 3.8455 2.56161 3.60582 3.03202C3.33333 3.5668 3.33333 4.26686 3.33333 5.66699V14.3337C3.33333 15.7338 3.33333 16.4339 3.60582 16.9686C3.8455 17.439 4.22795 17.8215 4.69836 18.0612C5.23314 18.3337 5.9332 18.3337 7.33333 18.3337H10M11.6667 9.16699H6.66667M8.33333 12.5003H6.66667M13.3333 5.83366H6.66667M12.0833 15.8337L13.75 17.5003L17.5 13.7503" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
      count: 0,
      children: [
        { path: "/nominations", label: "Nominations" },
        { path: "/nominations/pending", label: "Pending Nominations" },
        { path: "/nominations/declined", label: "Declined Nominations" },
      ],
    },
    {
      path: "/schedule",
      label: "Schedules",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 7.91699V11.2503L12.0833 12.5003M10 4.16699C6.08798 4.16699 2.91666 7.33831 2.91666 11.2503C2.91666 15.1623 6.08798 18.3337 10 18.3337C13.912 18.3337 17.0833 15.1623 17.0833 11.2503C17.0833 7.33831 13.912 4.16699 10 4.16699ZM10 4.16699V1.66699M8.33333 1.66699H11.6667M16.9408 4.66036L15.6908 3.41036L16.3158 4.03536M3.05918 4.66036L4.30918 3.41036L3.68418 4.03536" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      count: 0,
      // children: [
      // { path: "/schedule", label: "Schedules" },
      // { path: "/scheduling/pending", label: "Pending schedules" },
      // ],
    },
    {
      path: "/organizations",
      label: "Institutions",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.12461 18V11.6796C7.12461 11.2013 7.12461 10.9621 7.2177 10.7794C7.29959 10.6187 7.43025 10.4881 7.59096 10.4062C7.77366 10.3131 8.01283 10.3131 8.49117 10.3131H10.8827C11.361 10.3131 11.6002 10.3131 11.7829 10.4062C11.9436 10.4881 12.0742 10.6187 12.1561 10.7794C12.2492 10.9621 12.2492 11.2013 12.2492 11.6796V18M8.84793 2.42462L3.05515 6.93011C2.66793 7.23128 2.47431 7.38187 2.33483 7.57046C2.21128 7.73751 2.11923 7.9257 2.06323 8.12579C2 8.35167 2 8.59695 2 9.08751V15.2669C2 16.2236 2 16.7019 2.18618 17.0673C2.34995 17.3887 2.61128 17.65 2.93269 17.8138C3.2981 18 3.77644 18 4.73312 18H14.6407C15.5974 18 16.0757 18 16.4411 17.8138C16.7626 17.65 17.0239 17.3887 17.1876 17.0673C17.3738 16.7019 17.3738 16.2236 17.3738 15.2669V9.08751C17.3738 8.59695 17.3738 8.35167 17.3106 8.12579C17.2546 7.9257 17.1626 7.73751 17.039 7.57046C16.8995 7.38187 16.7059 7.23129 16.3187 6.93011L10.5259 2.42462C10.2258 2.19123 10.0758 2.07454 9.91013 2.02968C9.76395 1.99011 9.60988 1.99011 9.4637 2.02968C9.29803 2.07454 9.14799 2.19123 8.84793 2.42462Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
      children: [
        { path: "/organizations", label: "All Institutions" },
        { path: "/organizations/pending", label: "Pending Approvals" },
      ],
    },
    {
      path: "/users",
      label: "Users",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 13.1974C16.2133 13.8069 17.2534 14.785 18.0127 16.008C18.1631 16.2502 18.2382 16.3713 18.2642 16.539C18.3171 16.8798 18.084 17.2988 17.7666 17.4336C17.6104 17.5 17.4347 17.5 17.0833 17.5M13.3333 9.6102C14.5681 8.99657 15.4167 7.72238 15.4167 6.25C15.4167 4.77762 14.5681 3.50343 13.3333 2.8898M11.6667 6.25C11.6667 8.32107 9.98774 10 7.91667 10C5.8456 10 4.16667 8.32107 4.16667 6.25C4.16667 4.17893 5.8456 2.5 7.91667 2.5C9.98774 2.5 11.6667 4.17893 11.6667 6.25ZM2.13269 15.782C3.46128 13.7871 5.55781 12.5 7.91667 12.5C10.2755 12.5 12.3721 13.7871 13.7006 15.782C13.9917 16.219 14.1372 16.4375 14.1205 16.7166C14.1074 16.9339 13.965 17.2 13.7913 17.3313C13.5683 17.5 13.2615 17.5 12.648 17.5H3.1853C2.57181 17.5 2.26507 17.5 2.04203 17.3313C1.86837 17.2 1.72591 16.9339 1.71286 16.7166C1.69611 16.4375 1.84164 16.219 2.13269 15.782Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
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
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 17.5H3.83333C3.36662 17.5 3.13327 17.5 2.95501 17.4092C2.79821 17.3293 2.67072 17.2018 2.59083 17.045C2.5 16.8667 2.5 16.6334 2.5 16.1667V3.83333C2.5 3.36662 2.5 3.13327 2.59083 2.95501C2.67072 2.79821 2.79821 2.67072 2.95501 2.59083C3.13327 2.5 3.36662 2.5 3.83333 2.5H6.16667C6.63338 2.5 6.86673 2.5 7.04499 2.59083C7.20179 2.67072 7.32928 2.79821 7.40917 2.95501C7.5 3.13327 7.5 3.36662 7.5 3.83333V5.83333M7.5 17.5H12.5M7.5 17.5L7.5 5.83333M7.5 5.83333H11.1667C11.6334 5.83333 11.8667 5.83333 12.045 5.92416C12.2018 6.00406 12.3293 6.13154 12.4092 6.28834C12.5 6.4666 12.5 6.69996 12.5 7.16667V17.5M12.5 9.16667H16.1667C16.6334 9.16667 16.8667 9.16667 17.045 9.25749C17.2018 9.33739 17.3293 9.46487 17.4092 9.62167C17.5 9.79993 17.5 10.0333 17.5 10.5V16.1667C17.5 16.6334 17.5 16.8667 17.4092 17.045C17.3293 17.2018 17.2018 17.3293 17.045 17.4092C16.8667 17.5 16.6334 17.5 16.1667 17.5H12.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
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
    // this.pendingItemsService.pendingDeclarations$.subscribe((count) => {
    //   this.updateMenuItemCount("declarations", count);
    // });

    // this.pendingItemsService.pendingNominations$.subscribe((count) => {
    //   this.updateMenuItemCount("nominations", count);
    // });

    // this.pendingItemsService.pendingContracts$.subscribe((count) => {
    //   this.updateMenuItemCount("contracts", count);
    // });

    // this.pendingItemsService.getTotalPendingCount().subscribe((count) => {
    //   this.updateMenuItemCount("pending-approvals", count);
    // });

    // Update pending organizations count
    // this.organizationService
    //   .getPendingOrganizations()
    //   .subscribe((organizations) => {
    //     this.pendingOrganizations = organizations.length;
    //   });

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
      case "G":
        return this.menuItems; // Show all items except allocations, which are already removed
      case "M":
        return this.menuItems.filter((item) =>
          [
            "/dashboard",
            "/users",
            "/declarations",
            "/schedule",
            "/nominations",
            "/reports",
          ].includes(item.path)
        );
      case "U":
        return this.menuItems.filter((item) =>
          [
            "/dashboard",
            "/users",
            "/declarations",
            "/schedule",
            "/reports",
          ].includes(item.path)
        );
      case "D":
        return this.menuItems.filter((item) =>
          [
            "/dashboard",
            "/users",
            "/nominations",
            "/schedule",
            "/reports",
          ].includes(item.path)
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
