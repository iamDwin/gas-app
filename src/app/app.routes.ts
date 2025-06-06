import { Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { RoleGuard } from "./core/guards/role.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "forgot-password",
    loadComponent: () =>
      import("./features/auth/forgot-password/forgot-password.component").then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: "",
    canActivate: [AuthGuard],
    loadComponent: () =>
      import("./features/layout/layout.component").then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: "organizations",
        canActivate: [RoleGuard],
        data: { role: "admin" },
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./features/organizations/organizations.component").then(
                (m) => m.OrganizationsComponent
              ),
          },
          {
            path: "pending",
            loadComponent: () =>
              import(
                "./features/organizations/pending-organizations/pending-organizations.component"
              ).then((m) => m.PendingOrganizationsComponent),
          },
        ],
      },
      {
        path: "users",
        canActivate: [RoleGuard],
        data: { role: "admin" },
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./features/users/users.component").then(
                (m) => m.UsersComponent
              ),
          },
          {
            path: "pending",
            loadComponent: () =>
              import(
                "./features/users/pending-users/pending-users.component"
              ).then((m) => m.PendingUsersComponent),
          },
        ],
      },

      {
        path: "declarations",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./features/declarations/declarations.component").then(
                (m) => m.DeclarationsComponent
              ),
          },
          {
            path: "pending",
            loadComponent: () =>
              import(
                "./features/declarations/pending-declarations/pending-declarations.component"
              ).then((m) => m.PendingDeclarationsComponent),
          },
          {
            path: "declined",
            loadComponent: () =>
              import(
                "./features/declarations/declined-declarations/declined-declarations.component"
              ).then((m) => m.DeclinedDeclarationsComponent),
          },
          {
            path: ":id",
            loadComponent: () =>
              import(
                "./features/declarations/declaration-daily-view/declaration-daily-view.component"
              ).then((m) => m.DeclarationDailyViewComponent),
          },
        ],
      },
      {
        path: "nominations",

        children: [
          {
            path: "",
            loadComponent: () =>
              import("./features/nominations/nominations.component").then(
                (m) => m.NominationsComponent
              ),
          },
          {
            path: "pending",
            loadComponent: () =>
              import(
                "./features/nominations/pending-nominations/pending-nominations.component"
              ).then((m) => m.PendingNominationsComponent),
          },
          {
            path: "declined",
            loadComponent: () =>
              import(
                "./features/nominations/declined-nominations/declined-nominations.component"
              ).then((m) => m.DeclinedNominationsComponent),
          },
          {
            path: ":id",
            loadComponent: () =>
              import(
                "./features/nominations/nominations-daily-view/nominations-daily-view.component"
              ).then((m) => m.NominationsDailyViewComponent),
          },
        ],
      },
      {
        path: "schedule",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./features/schedule/schedule.component").then(
                (m) => m.ScheduleComponent
              ),
          },
          // {
          //   path: "pending",
          //   loadComponent: () =>
          //     import(
          //       "./features/nominations/pending-nominations/pending-nominations.component"
          //     ).then((m) => m.PendingNominationsComponent),
          // },
          // {
          //   path: ":id",
          //   loadComponent: () =>
          //     import(
          //       "./features/nominations/nominations-daily-view/nominations-daily-view.component"
          //     ).then((m) => m.NominationsDailyViewComponent),
          // },
        ],
      },
      {
        path: "pending-approvals",
        loadComponent: () =>
          import(
            "./features/pending-approvals/pending-approvals.component"
          ).then((m) => m.PendingApprovalsComponent),
      },

      {
        path: "reports",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./features/reports/reports.component").then(
                (m) => m.ReportsComponent
              ),
          },
          {
            path: ":id",
            loadComponent: () =>
              import(
                "./features/reports/report-details/report-details.component"
              ).then((m) => m.ReportDetailsComponent),
          },
        ],
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
    ],
  },
];
