// modules/service-items/service-item-table/service-item-table.component.ts
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessRecordService } from '../../../core/services/process-record.service';
import { ProcessDefinitionService } from '../../../core/services/process-definition.service';
import { ProcessRecord } from '../../../core/models/process-record.model';
import { ProcessField } from '../../../core/models/process-field.model';
import { ServiceItemFormComponent } from '../service-item-form/service-item-form.component';
import { ToastService } from '../../../shared/utils/toast.service';

@Component({
  selector: 'app-service-item-table',
  standalone: true,
  imports: [CommonModule, GridModule, ButtonsModule, ServiceItemFormComponent],
  templateUrl: './service-item-table.component.html'
})
export class ServiceItemTableComponent implements OnInit, OnChanges {
  @Input() selectedProcessDefinitionId: number | null = null;
  @Input() applicationId: number | null = null;

  records: ProcessRecord[] = [];
  processFields: ProcessField[] = [];
  loading = false;
  pageSize = 20;
  pageNumber = 1;
  totalCount = 0;
  selectedRecordId: number | null = null;
  viewEditMode: 'view' | 'edit' | null = null;

  constructor(
    private processRecordService: ProcessRecordService,
    private processDefinitionService: ProcessDefinitionService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProcessDefinitionId'] && this.selectedProcessDefinitionId) {
      this.loadRecords();
      this.loadProcessFields();
    }
  }

  loadRecords(): void {
    if (!this.selectedProcessDefinitionId) return;
    
    this.loading = true;
    this.processRecordService.getRecordsByProcess(this.selectedProcessDefinitionId, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.records = response.records;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading records:', err);
        this.loading = false;
      }
    });
  }

  loadProcessFields(): void {
    if (!this.selectedProcessDefinitionId) return;

    this.processDefinitionService.getProcessDefinitionStructure(this.selectedProcessDefinitionId).subscribe({
      next: (response) => {
        this.processFields = response.fields;
      },
      error: (err) => console.error('Error loading process fields:', err)
    });
  }

  onView(recordId: number): void {
    this.selectedRecordId = recordId;
    this.viewEditMode = 'view';
  }

  onEdit(recordId: number): void {
    this.selectedRecordId = recordId;
    this.viewEditMode = 'edit';
  }

  onDelete(recordId: number): void {
    if (!this.selectedProcessDefinitionId) return;
    
    if (confirm('Are you sure you want to delete this record?')) {
      this.processRecordService.deleteRecord(this.selectedProcessDefinitionId, recordId).subscribe({
        next: () => {
          this.toastService.showSuccess('Record deleted successfully');
          this.loadRecords();
        },
        error: (err) => {
          console.error('Error deleting record:', err);
          this.toastService.showError(err.error?.message || 'Failed to delete record');
        }
      });
    }
  }

  onFormClose(): void {
    this.viewEditMode = null;
    this.selectedRecordId = null;
    this.loadRecords();
  }

  onPageChange(event: any): void {
    this.pageNumber = event.skip / event.take + 1;
    this.pageSize = event.take;
    this.loadRecords();
  }

  getDisplayColumns(): string[] {

    console.log(this.processFields);
    return this.processFields.map(f => f.fieldName);
    
  }
}