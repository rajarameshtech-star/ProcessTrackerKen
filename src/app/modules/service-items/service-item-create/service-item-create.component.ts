// modules/service-items/service-item-create/service-item-create.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ApplicationService } from '../../../core/services/application.service';
import { ProcessDefinitionService } from '../../../core/services/process-definition.service';
import { ProcessRecordService } from '../../../core/services/process-record.service';
import { ToastService } from '../../../shared/utils/toast.service';
import { Application } from '../../../core/models/application.model';
import { ProcessDefinition } from '../../../core/models/process-definition.model';
import { ServiceItemFormComponent } from '../service-item-form/service-item-form.component';

@Component({
  selector: 'app-service-item-create',
  standalone: true,
  imports: [CommonModule, FormsModule, DropDownsModule, ButtonsModule, ServiceItemFormComponent],
  templateUrl: './service-item-create.component.html'
})
export class ServiceItemCreateComponent implements OnInit {
  applications: Application[] = [];
  processDefinitions: ProcessDefinition[] = [];
  selectedAppId: number | null = null;
  selectedProcDefId: number | null = null;
  loading = false;

  constructor(
    private applicationService: ApplicationService,
    private processDefinitionService: ProcessDefinitionService,
    private processRecordService: ProcessRecordService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['applicationId']) {
        this.selectedAppId = Number(params['applicationId']);
      }
      if (params['processDefinitionId']) {
        this.selectedProcDefId = Number(params['processDefinitionId']);
      }
    });

    this.loadApplications();
    this.loadProcessDefinitions();
  }

  loadApplications(): void {
    this.applicationService.getAllActiveApplications(1, 100).subscribe({
      next: (response) => {
        this.applications = response.records;
      },
      error: (err) => console.error('Error loading applications:', err)
    });
  }

  loadProcessDefinitions(): void {
    this.processDefinitionService.getAllActiveProcessDefinitions(1, 100).subscribe({
      next: (response) => {
        this.processDefinitions = response.records;
      },
      error: (err) => console.error('Error loading process definitions:', err)
    });
  }



  onFormSubmit(data: any): void {
    if (!this.selectedAppId || !this.selectedProcDefId) {
      this.toastService.showError('Please select both Application and Process Definition');
      return;
    }

    this.loading = true;
    this.processRecordService.createRecord(this.selectedProcDefId, this.selectedAppId, { fieldValues: data }).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Service Item created successfully');
        this.loading = false;
        this.router.navigate(['/service-items'], {
          queryParams: {
            applicationId: this.selectedAppId,
            processDefinitionId: this.selectedProcDefId
          },
          queryParamsHandling: 'merge'
        });
      },
      error: (err) => {
        console.error('Error creating service item:', err);
        this.toastService.showError(err.error?.title || 'Failed to create service item');
        this.loading = false;
      }
    });
  }

  onFormCancel(): void {
    this.router.navigate(['/service-items'], { queryParamsHandling: 'preserve' });
  }
}