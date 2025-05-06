import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Declaration } from './declaration.model';
import { DeclarationService } from './declaration.service';
import { DeclarationFormComponent } from './declaration-form/declaration-form.component';
import { DataTableComponent, TableAction } from '../../shared/components/data-table/data-table.component';
import { AuthService } from '../../core/auth/auth.service';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-declarations',
  standalone: true,
  imports: [CommonModule, DeclarationFormComponent, DataTableComponent, ButtonComponent],
  template: `
    <div class="p-4">
      <app-data-table
        [rows]="formattedDeclarations"
        [columns]="columns"
        [actions]="actions"
        [loading]="isLoading"
        [loadingMessage]="loadingMessage"
        defaultSort="createdAt"
        (actionClick)="onActionClick($event)"
      >
        <div tableActions>
          <app-button 
            variant="filled"
            (click)="openDrawer()"
            [iconLeft]="'<svg class=&quot;w-5 h-5&quot; fill=&quot;none&quot; viewBox=&quot;0 0 24 24&quot; stroke=&quot;currentColor&quot;><path stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; stroke-width=&quot;2&quot; d=&quot;M12 6v6m0 0v6m0-6h6m-6 0H6&quot;/></svg>'"
          >
            New Declaration
          </app-button>
        </div>
      </app-data-table>

      <!-- Drawer -->
      <div 
        class="drawer"
        [class.drawer-open]="isDrawerOpen"
        [class.drawer-closed]="!isDrawerOpen"
      >
        <app-declaration-form
          *ngIf="isDrawerOpen"
          [declaration]="selectedDeclaration"
          (save)="saveDeclaration($event)"
          (onCancel)="closeDrawer()"
        ></app-declaration-form>
      </div>

      <!-- Backdrop -->
      <div 
        *ngIf="isDrawerOpen"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
        (click)="closeDrawer()"
      ></div>
    </div>
  `
})
export class DeclarationsComponent implements OnInit {
  declarations: Declaration[] = [];
  formattedDeclarations: any[] = [];
  isDrawerOpen = false;
  selectedDeclaration?: Declaration;
  isLoading = false;
  loadingMessage = 'Loading declarations...';

  columns = [
    { prop: 'title', name: 'Title' },
    { prop: 'status', name: 'Status' },
    { prop: 'createdAt', name: 'Created' },
    { prop: 'updatedAt', name: 'Updated' },
    { prop: 'actions', name: 'Actions', sortable: false }
  ];

  actions: TableAction[] = [
    { 
      label: 'Edit',
      type: 'primary',
      isDisabled: (row: Declaration) => row.status !== 'draft'
    },
    { 
      label: 'Delete',
      type: 'danger',
      isDisabled: (row: Declaration) => row.status !== 'draft'
    },
    {
      label: 'Approve',
      type: 'success',
      isDisabled: (row: Declaration) => !this.canApprove(row)
    },
    {
      label: 'Reject',
      type: 'warning',
      isDisabled: (row: Declaration) => !this.canReject(row)
    }
  ];

  constructor(
    private declarationService: DeclarationService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Declarations', link: '/declarations' }
    ]);

    this.loadDeclarations();
  }

  formatDate(date: Date): string {
    const today = new Date();
    const declarationDate = new Date(date);
    
    if (declarationDate.toDateString() === today.toDateString()) {
      return declarationDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    if (declarationDate.getFullYear() === today.getFullYear()) {
      return declarationDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
    
    return declarationDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatDeclarations(declarations: Declaration[]) {
    this.formattedDeclarations = declarations.map(declaration => ({
      ...declaration,
      createdAt: this.formatDate(declaration.createdAt),
      updatedAt: this.formatDate(declaration.updatedAt)
    }));
  }

  loadDeclarations() {
    this.isLoading = true;
    setTimeout(() => {
      this.declarationService.getDeclarations().subscribe(declarations => {
        this.declarations = declarations;
        this.formatDeclarations(declarations);
        this.isLoading = false;
      });
    }, 1000);
  }

  canApprove(declaration: Declaration): boolean {
    const isAdmin = this.authService.isAdmin();
    const isOrgAdmin = this.authService.getCurrentUser()?.role === 'org_admin';
    
    return (isAdmin && declaration.status === 'pending_admin_approval') ||
           (isOrgAdmin && declaration.status === 'pending_org_approval');
  }

  canReject(declaration: Declaration): boolean {
    return this.canApprove(declaration);
  }

  onActionClick(event: {action: TableAction, row: Declaration}) {
    switch (event.action.label) {
      case 'Edit':
        this.editDeclaration(event.row);
        break;
      case 'Delete':
        this.deleteDeclaration(event.row.id);
        break;
      case 'Approve':
        this.approveDeclaration(event.row);
        break;
      case 'Reject':
        this.rejectDeclaration(event.row);
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

  editDeclaration(declaration: Declaration) {
    this.selectedDeclaration = declaration;
    this.isDrawerOpen = true;
  }

  approveDeclaration(declaration: Declaration) {
    this.isLoading = true;
    this.loadingMessage = 'Approving declaration...';
    
    setTimeout(() => {
      this.declarationService.approveDeclaration(declaration.id);
      this.notificationService.addNotification({
        title: 'Declaration Approved',
        message: `Declaration "${declaration.title}" has been approved`,
        type: 'success'
      });
      this.loadDeclarations();
    }, 1000);
  }

  rejectDeclaration(declaration: Declaration) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.isLoading = true;
      this.loadingMessage = 'Rejecting declaration...';
      
      setTimeout(() => {
        this.declarationService.rejectDeclaration(declaration.id, reason);
        this.notificationService.addNotification({
          title: 'Declaration Rejected',
          message: `Declaration "${declaration.title}" has been rejected`,
          type: 'error'
        });
        this.loadDeclarations();
      }, 1000);
    }
  }

  saveDeclaration(declarationData: Omit<Declaration, 'id' | 'createdAt' | 'updatedAt'>) {
    this.isLoading = true;
    this.loadingMessage = this.selectedDeclaration ? 'Updating declaration...' : 'Creating declaration...';
    
    setTimeout(() => {
      const currentUser = this.authService.getCurrentUser();
      const data = {
        ...declarationData,
        organizationId: currentUser?.organizationId || '',
        createdBy: currentUser?.id || ''
      };

      if (this.selectedDeclaration) {
        this.declarationService.updateDeclaration({
          ...data,
          id: this.selectedDeclaration.id,
          createdAt: this.selectedDeclaration.createdAt,
          updatedAt: new Date()
        });
        this.notificationService.addNotification({
          title: 'Declaration Updated',
          message: `Declaration "${data.title}" has been updated`,
          type: 'success'
        });
      } else {
        this.declarationService.addDeclaration(data);
        this.notificationService.addNotification({
          title: 'Declaration Created',
          message: `Declaration "${data.title}" has been created`,
          type: 'success'
        });
      }
      
      this.loadDeclarations();
      this.closeDrawer();
    }, 1000);
  }

  deleteDeclaration(id: string) {
    if (confirm('Are you sure you want to delete this declaration?')) {
      this.isLoading = true;
      this.loadingMessage = 'Deleting declaration...';
      
      setTimeout(() => {
        this.declarationService.deleteDeclaration(id);
        this.notificationService.addNotification({
          title: 'Declaration Deleted',
          message: 'The declaration has been deleted successfully',
          type: 'success'
        });
        this.loadDeclarations();
      }, 1000);
    }
  }
}