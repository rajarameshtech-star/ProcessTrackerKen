// modules/service-items/service-items.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProcessDefinitionSelectComponent } from './process-definition-select/process-definition-select.component';
import { ServiceItemCreateComponent } from './service-item-create/service-item-create.component';
import { ServiceItemTableComponent } from './service-item-table/service-item-table.component';

@Component({
  selector: 'app-service-items',
  standalone: true,
  imports: [ProcessDefinitionSelectComponent, ServiceItemCreateComponent, ServiceItemTableComponent],
  templateUrl: './service-items.component.html'
})
export class ServiceItemsComponent implements OnInit {
  applicationId: number | null = null;
  applicationName: string | null = null;
  selectedProcessDefinitionId: number | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'] ? Number(params['applicationId']) : null;
      this.applicationName = params['applicationName'] || null;
    });
  }

  onProcessDefinitionSelected(processDefinitionId: number): void {
    console.log(processDefinitionId)
    this.selectedProcessDefinitionId = processDefinitionId;
  }
}