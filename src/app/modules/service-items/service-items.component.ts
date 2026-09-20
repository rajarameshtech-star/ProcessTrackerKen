// modules/service-items/service-items.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessDefinitionSelectComponent } from './process-definition-select/process-definition-select.component';
import { ServiceItemCreateComponent } from './service-item-create/service-item-create.component';
import { ServiceItemTableComponent } from './service-item-table/service-item-table.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { Application } from '../../core/models/application.model';

@Component({
  selector: 'app-service-items',
  standalone: true,
  imports: [ProcessDefinitionSelectComponent, ServiceItemTableComponent, ButtonsModule, DropDownsModule, FormsModule],
  templateUrl: './service-items.component.html'
})
export class ServiceItemsComponent implements OnInit {
  applicationId: number | null = null;
  applicationName: string | null = null;
  selectedProcessDefinitionId: number | null = null;

  isFormActive = false;

  applications: Application[] = [];
  defaultAppItem: { title: string, id: any } = { title: 'All Applications', id: null };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.loadApplications();
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'] ? Number(params['applicationId']) : null;
      this.applicationName = params['applicationName'] || null;
      if (params['processDefinitionId']) {
        this.selectedProcessDefinitionId = Number(params['processDefinitionId']);
      }
    });
  }

  loadApplications(): void {
    this.applicationService.getAllActiveApplications(1, 100).subscribe({
      next: (res) => this.applications = res.records,
      error: (err) => console.error('Failed to load apps', err)
    });
  }

  onApplicationChange(appId: number | null): void {
    const selectedApp = this.applications.find(a => a.id === appId);
    this.applicationName = selectedApp ? selectedApp.title : null;

    // Clear out application data if 'All' is selected, else bind ID
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        applicationId: appId,
        applicationName: this.applicationName
      },
      queryParamsHandling: 'merge'
    });
  }

  onProcessDefinitionSelected(processDefinitionId: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { processDefinitionId: processDefinitionId },
      queryParamsHandling: 'merge'
    }).then(() => {
      this.selectedProcessDefinitionId = processDefinitionId;
    });
  }

  onFormActiveChanged(isActive: boolean): void {
    this.isFormActive = isActive;
  }

  onCreateNew(): void {
    const queryParams: any = {};
    if (this.applicationId) queryParams.applicationId = this.applicationId;
    if (this.selectedProcessDefinitionId) queryParams.processDefinitionId = this.selectedProcessDefinitionId;

    this.router.navigate(['/service-items/create'], { queryParams });
  }
}