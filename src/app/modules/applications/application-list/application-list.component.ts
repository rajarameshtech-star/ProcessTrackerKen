import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../core/models/application.model';
import { ToastService } from '../../../shared/utils/toast.service';
import { ApplicationDialogComponent } from '../application-dialog/application-dialog.component';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, GridModule, DialogModule, ButtonsModule, ApplicationDialogComponent],
  templateUrl: './application-list.component.html'
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  loading = false;
  pageSize = 20;
  pageNumber = 1;

  isDialogOpen = false;
  selectedApplication: Application | null = null;
  dialogMode: 'create' | 'edit' = 'create';

  constructor(
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getAllApplications(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.applications = response.records;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.toastService.showError('Failed to load applications');
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.pageNumber = (event.skip / this.pageSize) + 1;
    this.loadApplications();
  }

  openDialog(application: Application | null = null): void {
    this.selectedApplication = application;
    this.dialogMode = application ? 'edit' : 'create';
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedApplication = null;
  }

  saveApplication(appData: any): void {
    if (this.dialogMode === 'create') {
      this.applicationService.createApplication(appData).subscribe({
        next: () => {
          this.toastService.showSuccess('Application created successfully');
          this.closeDialog();
          this.loadApplications();
        },
        error: (err) => {
          this.toastService.showError(err.error?.title || 'Error creating application');
        }
      });
    } else if (this.selectedApplication) {
      this.applicationService.updateApplication(this.selectedApplication.id, {
        ...appData,
        isActive: this.selectedApplication.isActive
      }).subscribe({
        next: () => {
          this.toastService.showSuccess('Application updated successfully');
          this.closeDialog();
          this.loadApplications();
        },
        error: (err) => {
          this.toastService.showError(err.error?.title || 'Error updating application');
        }
      });
    }
  }

  toggleActive(application: Application): void {
    this.applicationService.toggleActiveStatus(application.id).subscribe({
      next: () => {
        this.toastService.showSuccess(`Application ${application.isActive ? 'Deactivated' : 'Activated'}`);
        this.loadApplications();
      },
      error: () => this.toastService.showError('Error toggling status')
    });
  }

  viewServices(application: Application): void {
    // According to req: "open the applications process records in the service items tab via a query parameter"
    this.router.navigate(['/service-items'], { queryParams: { applicationId: application.id } });
  }
}
