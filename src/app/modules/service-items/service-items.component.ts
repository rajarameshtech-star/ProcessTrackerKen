// modules/service-items/service-items.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessDefinitionSelectComponent } from './process-definition-select/process-definition-select.component';
import { ServiceItemCreateComponent } from './service-item-create/service-item-create.component';
import { ServiceItemTableComponent } from './service-item-table/service-item-table.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-service-items',
  standalone: true,
  imports: [ProcessDefinitionSelectComponent, ServiceItemTableComponent, ButtonsModule],
  templateUrl: './service-items.component.html'
})
export class ServiceItemsComponent implements OnInit {
  applicationId: number | null = null;
  applicationName: string | null = null;
  selectedProcessDefinitionId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'] ? Number(params['applicationId']) : null;
      this.applicationName = params['applicationName'] || null;
      if (params['processDefinitionId']) {
        this.selectedProcessDefinitionId = Number(params['processDefinitionId']);
      }
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

  onCreateNew(): void {
    const queryParams: any = {};
    if (this.applicationId) queryParams.applicationId = this.applicationId;
    if (this.selectedProcessDefinitionId) queryParams.processDefinitionId = this.selectedProcessDefinitionId;

    this.router.navigate(['/service-items/create'], { queryParams });
  }
}