// modules/service-items/process-definition-select/process-definition-select.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessDefinitionService } from '../../../core/services/process-definition.service';
import { ProcessDefinition } from '../../../core/models/process-definition.model';

@Component({
  selector: 'app-process-definition-select',
  standalone: true,
  imports: [CommonModule, FormsModule, DropDownsModule, ButtonsModule],
  templateUrl: './process-definition-select.component.html'
})
export class ProcessDefinitionSelectComponent implements OnInit {
  @Input() applicationId: number | null = null;
  @Output() processDefinitionSelected = new EventEmitter<number>();

  processDefinitions: ProcessDefinition[] = [];
  selectedProcessDefinitionId: number | null = null;
  loading = false;

  constructor(private processDefinitionService: ProcessDefinitionService) { }

  ngOnInit(): void {
    this.loadProcessDefinitions();
  }

  loadProcessDefinitions(): void {
    this.loading = true;
    this.processDefinitionService.getAllActiveProcessDefinitions(1, 100).subscribe({
      next: (response) => {
        this.processDefinitions = response.records;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading process definitions:', err);
        this.loading = false;
      }
    });
  }


onProcessDefinitionChange(event: any): void {
  this.selectedProcessDefinitionId = event.id;
}

onShow(): void {
  if (this.selectedProcessDefinitionId) {
    this.processDefinitionSelected.emit(this.selectedProcessDefinitionId);
  }
}

}