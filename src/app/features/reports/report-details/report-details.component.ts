import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BreadcrumbService } from "../../../shared/services/breadcrumb.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { LoadingComponent } from "../../../shared/components/loading/loading.component";
import { ToastService } from "../../../shared/services/toast.service";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import {
  Declaration,
  DailyViewDeclaration,
} from "../../declarations/declaration.model";
import { DeclarationService } from "../../declarations/declaration.service";
import { ReportService } from "../report.service";
import { saveAs } from "file-saver"; // You might need to install this package

@Component({
  selector: "app-report-details",
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, ButtonComponent],
  templateUrl: "./report-details.component.html",
})
export class ReportDetailsComponent implements OnInit {
  isloadingMessage: string = "Loading...";
  isLoading: boolean = false;
  declaration?: Declaration;
  declarationData: any;
  declarationDetails!: DailyViewDeclaration[];
  editingDates = new Set<string>();
  originalQuantities = new Map<string, number>();
  selectedDate?: string;
  declarationId?: any;
  // Pagination
  currentPage = 1;
  pageSize = 7; // One week
  totalPages = 1;
  currentPageData: Partial<DailyViewDeclaration>[] = [];
  currentWeekStart?: string;
  currentWeekEnd?: string;

  constructor(
    private route: ActivatedRoute,
    private navigator: Router,
    private toaster: ToastService,
    private reportService: ReportService,
    private declarationService: DeclarationService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.declarationId = params["id"];
      this.loadDeclaration(this.declarationId);
    });

    this.breadcrumbService.setBreadcrumbs([
      { label: "Reports", link: "/reports" },
      {
        label: "Report Details",
        link: `/reports/${this.declarationId}`,
      },
    ]);
  }

  loadDeclaration(id: string) {
    this.isLoading = true;
    this.declarationService.getDeclaration(id).subscribe((decDetails) => {
      if (decDetails) {
        this.declarationDetails = decDetails;
        this.calculateTotalPages();
        this.loadCurrentPage();
        this.getMainDataFromSet();
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.toaster.show({
          title: "Declaration Details Action",
          message: "Failed to load declaration details",
          type: "error",
        });
        this.navigator.navigateByUrl("/declarations");
      }
    });
  }

  getMainDataFromSet() {
    const firstItem = this.declarationDetails[0];
    const lastItem =
      this.declarationDetails[this.declarationDetails.length - 1];

    const payload = {
      institutionCode: firstItem.institutionCode,
      institutionName: firstItem.institutionName,
      declaredQuantity: firstItem.declaredQuantity,
      status: firstItem.status,
      startDate: firstItem.date,
      endDate: lastItem.date,
    };
    this.declarationData = payload;
  }

  calculateTotalPages() {
    if (this.declarationDetails) {
      this.totalPages = Math.ceil(
        this.declarationDetails.length / this.pageSize
      );
    }
  }

  loadCurrentPage() {
    if (!this.declarationDetails) return;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.currentPageData = this.declarationDetails?.slice(startIndex, endIndex);

    if (this.currentPageData.length > 0) {
      this.currentWeekStart = this.currentPageData[0].date;
      this.currentWeekEnd =
        this.currentPageData[this.currentPageData.length - 1].date;
    }
  }

  // ✅
  onDateSelected() {
    if (!this.selectedDate || !this.declarationData) return;

    // Find the week that contains the selected date
    const index = this.declarationDetails.findIndex(
      (dq) => dq.date === this.selectedDate
    );
    if (index !== -1) {
      this.currentPage = Math.floor(index / this.pageSize) + 1;
      this.loadCurrentPage();
    }
  }

  // ✅
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCurrentPage();
    }
  }

  // ✅
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCurrentPage();
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  isEditing(date: string): boolean {
    return date ? this.editingDates.has(date) : false;
  }

  startEditing(date: string) {
    console.log(date);
    const quantity = this.declarationDetails?.find(
      (dq) => dq.date === date
    )?.declaredQuantity;
    if (quantity !== undefined) {
      this.originalQuantities.set(date, quantity);
      this.editingDates.add(date);
    }
  }

  updateQuantity(event: Event, date: string) {
    const input = event.target as HTMLInputElement;
    const quantity = Number(input.value);

    if (this.declaration) {
      this.declaration.dailyQuantities = this.declaration.dailyQuantities.map(
        (dq) => (dq.date === date ? { ...dq, quantity } : dq)
      );
      this.loadCurrentPage();
    }
  }

  saveEdit(date: string) {
    if (this.declaration) {
      const quantity = this.declaration.dailyQuantities.find(
        (dq) => dq.date === date
      )?.quantity;
      if (quantity !== undefined) {
        // this.declarationService.updateDailyQuantity(
        //   this.declaration.id,
        //   date,
        //   quantity
        // );
        this.notificationService.addNotification({
          title: "Quantity Updated",
          message: `Quantity for ${this.formatDate(date)} has been updated`,
          type: "success",
        });
      }
    }
    this.editingDates.delete(date);
    this.originalQuantities.delete(date);
  }

  cancelEdit(date: string) {
    const originalQuantity = this.originalQuantities.get(date);
    if (originalQuantity !== undefined && this.declaration) {
      this.declaration.dailyQuantities = this.declaration.dailyQuantities.map(
        (dq) => (dq.date === date ? { ...dq, quantity: originalQuantity } : dq)
      );
      this.loadCurrentPage();
    }
    this.editingDates.delete(date);
    this.originalQuantities.delete(date);
  }

  downloadReport() {
    this.isLoading = true;
    this.isloadingMessage = "Downloading Report";
    const requestId = this.declarationId;
    this.reportService.downloadReport2(requestId).subscribe({
      next: (response) => {
        console.log({ response });
        this.downLoadFile(response, "declaration");
        this.toaster.show({
          title: "Download Report",
          message: "Report generated and downloaded successfully",
          type: "success",
        });
      },
      error: (error) => {
        this.toaster.show({
          title: "Download Error",
          message: "Failed to download the report",
          type: "error",
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, product: any) {
    let binaryData = [];
    binaryData.push(data);
    let downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(
      new Blob([data], {
        type: "application/pdf",
      })
    );
    downloadLink.setAttribute(
      "download",
      product + "_" + new Date().toLocaleString()
    );
    console.log({ downloadLink });
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  showApproveConfirmation() {}
  showRejectConfirmation() {}
}
