import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
// import { Declaration } from "./declaration.model";
// import { nominationService } from "./declaration.service";
// import { DeclarationFormComponent } from "./declaration-form/declaration-form.component";
import {
  DataTableComponent,
  TableAction,
} from "../../shared/components/data-table/data-table.component";
import { AuthService } from "../../core/auth/auth.service";
import { BreadcrumbService } from "../../shared/services/breadcrumb.service";
import { NotificationService } from "../../shared/services/notification.service";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { Nomination } from "./nominations.model";
import { NominationService } from "./nominations.service";

@Component({
  selector: "app-nominations",
  standalone: true,
  imports: [
    CommonModule,
    // DeclarationFormComponent,
    DataTableComponent,
    ButtonComponent,
  ],
  templateUrl: "./nominations.component.html",
})
export class NominationsComponent implements OnInit {
  declarations: Nomination[] = [];
  formattedDeclarations: any[] = [];
  isDrawerOpen = false;
  selectedDeclaration?: Nomination;
  isLoading = false;
  loadingMessage = "Loading Nominations...";

  columns = [
    { prop: "institutionCode", name: "Institution" },
    { prop: "declaredQuantity", name: "Quantity" },
    { prop: "startDate", name: "Start Date" },
    { prop: "endDate", name: "End Date" },
    { prop: "status", name: "Status" },
    { prop: "actions", name: "Actions", sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: "View Details",
      type: "primary",
    },
    {
      label: "Edit",
      type: "primary",
      isDisabled: (row: Nomination) => row.status !== "draft",
    },
    {
      label: "Delete",
      type: "danger",
      isDisabled: (row: Nomination) => row.status !== "draft",
    },
  ];

  constructor(
    private nominationService: NominationService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: "Nominations", link: "/nominations" },
    ]);

    // this.loadDeclarations();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatDeclarations(declarations: Nomination[]) {
    this.formattedDeclarations = declarations.map((declaration) => ({
      ...declaration,
      startDate: this.formatDate(declaration.startDate),
      endDate: this.formatDate(declaration.endDate),
    }));
  }

  loadDeclarations() {
    this.isLoading = true;
    setTimeout(() => {
      this.nominationService.getDeclarations().subscribe((nomination: any) => {
        this.declarations = nomination;
        this.formatDeclarations(nomination);
        this.isLoading = false;
      });
    }, 1000);
  }

  onActionClick(event: { action: TableAction; row: Nomination }) {
    switch (event.action.label) {
      case "View Details":
        this.router.navigate(["/nominations", event.row.id]);
        break;
      case "Edit":
        // this.editDeclaration(event.row);
        break;
      case "Delete":
        // this.deleteDeclaration(event.row.id);
        break;
    }
  }

  openDrawer() {
    this.selectedDeclaration = undefined;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedDeclaration = undefined;
  }

  editDeclaration(declaration: Nomination) {
    this.selectedDeclaration = declaration;
    this.isDrawerOpen = true;
  }

  // saveDeclaration(declarationData: Partial<Nomination>) {
  //   this.isLoading = true;
  //   this.loadingMessage = this.selectedDeclaration
  //     ? "Updating nominations..."
  //     : "Creating nominations...";

  //   setTimeout(() => {
  //     const currentUser = this.authService.getCurrentUser();

  //     if (this.selectedDeclaration) {
  //       // Update existing declaration
  //       const updatedDeclaration: Nomination = {
  //         ...this.selectedDeclaration,
  //         ...declarationData,
  //         updatedAt: new Date(),
  //       };

  //       this.nominationService.updateDeclaration(updatedDeclaration);
  //       this.notificationService.addNotification({
  //         title: "Nominations Updated",
  //         message: `Nominations "${updatedDeclaration.title}" has been updated`,
  //         type: "success",
  //       });
  //     } else {
  //       // Create new declaration
  //       const newDeclaration: Omit<
  //         Nomination,
  //         "id" | "createdAt" | "updatedAt"
  //       > = {
  //         ...declarationData,
  //         organizationId: currentUser?.organizationId || "",
  //         createdBy: currentUser?.id || "",
  //         status: "draft",
  //       } as Omit<Nomination, "id" | "createdAt" | "updatedAt">;

  //       this.nominationService.addDeclaration(newDeclaration);
  //       this.notificationService.addNotification({
  //         title: "Nominations Created",
  //         message: `Nominations "${newDeclaration.title}" has been created`,
  //         type: "success",
  //       });
  //     }

  //     this.loadDeclarations();
  //     this.closeDrawer();
  //   }, 2000);
  // }

  // deleteDeclaration(id: string) {
  //   if (confirm("Are you sure you want to delete this declaration?")) {
  //     this.isLoading = true;
  //     this.loadingMessage = "Deleting Nominations...";

  //     setTimeout(() => {
  //       this.nominationService.deleteDeclaration(id);
  //       this.notificationService.addNotification({
  //         title: "Nominations Deleted",
  //         message: "The Nominations has been deleted successfully",
  //         type: "success",
  //       });
  //       this.loadDeclarations();
  //     }, 2000);
  //   }
  // }
}
