import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessFieldListComponent } from './process-field-list/process-field-list.component';
import { ProcessDefinitionService } from '../../core/services/process-definition.service';

@Component({
    selector: 'app-process-fields',
    standalone: true,
    imports: [CommonModule, ButtonsModule, ProcessFieldListComponent],
    template: `
    <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.align-items]="'center'" [style.margin-bottom.px]="15">
      <div [style.display]="'flex'" [style.align-items]="'center'" [style.gap.px]="10">
        <button kendoButton icon="arrow-left" (click)="goBack()">Back</button>
        <h2 [style.margin]="0">Manage Fields: {{ processName }}</h2>
      </div>
      <button kendoButton themeColor="primary" (click)="onCreateNew()">
        Create New Field
      </button>
    </div>
    
    @if (processDefinitionId) {
      <app-process-field-list [processDefinitionId]="processDefinitionId"></app-process-field-list>
    }
  `
})
export class ProcessFieldsComponent implements OnInit {
    processDefinitionId: number | null = null;
    processName = 'Loading...';

    @ViewChild(ProcessFieldListComponent) list!: ProcessFieldListComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private processDefinitionService: ProcessDefinitionService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['processDefinitionId']) {
                this.processDefinitionId = Number(params['processDefinitionId']);
                this.loadProcessDefinition(this.processDefinitionId);
            }
        });
    }

    loadProcessDefinition(id: number): void {
        this.processDefinitionService.getProcessDefinitionById(id).subscribe({
            next: (def) => this.processName = def.name,
            error: () => this.processName = 'Unknown Process'
        });
    }

    goBack(): void {
        this.router.navigate(['/process-types']);
    }

    onCreateNew(): void {
        if (this.list) {
            this.list.openDialog();
        }
    }
}
