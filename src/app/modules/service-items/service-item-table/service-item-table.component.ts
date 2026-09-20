import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessRecordService } from '../../../core/services/process-record.service';
import { ProcessDefinitionService } from '../../../core/services/process-definition.service';
import { ProcessRecord } from '../../../core/models/process-record.model';
import { ProcessField } from '../../../core/models/process-field.model';
import { ServiceItemFormComponent } from '../service-item-form/service-item-form.component';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';
import { ToastService } from '../../../shared/utils/toast.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-service-item-table',
  standalone: true,
  imports: [CommonModule, GridModule, ButtonsModule, ServiceItemFormComponent, FilterPanelComponent],
  templateUrl: './service-item-table.component.html'
})
export class ServiceItemTableComponent implements OnInit, OnChanges {
  @Input() selectedProcessDefinitionId: number | null = null;
  @Input() applicationId: number | null = null;
  @Output() formActive = new EventEmitter<boolean>();

  records: ProcessRecord[] = [];
  processFields: ProcessField[] = [];
  displayColumns: string[] = [];
  loading = false;
  pageSize = 20;
  pageNumber = 1;
  totalCount = 0;
  selectedRecordId: number | null = null;
  viewEditMode: 'view' | 'edit' | null = null;
  activeFilters: any = {};

  constructor(
    private processRecordService: ProcessRecordService,
    private processDefinitionService: ProcessDefinitionService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProcessDefinitionId'] && this.selectedProcessDefinitionId) {
      this.records = [];
      this.totalCount = 0;
      this.processFields = [];
      this.displayColumns = [];
      this.activeFilters = {};
      this.pageNumber = 1;
      this.loadData();
    } else if (changes['applicationId'] && !changes['selectedProcessDefinitionId']) {
      if (this.selectedProcessDefinitionId) {
        this.pageNumber = 1;
        this.loadRecords();
      }
    }
  }

  loadData(): void {
    if (!this.selectedProcessDefinitionId) return;
    this.loading = true;

    const fieldsReq = this.processDefinitionService.getProcessDefinitionStructure(this.selectedProcessDefinitionId);
    const recordsReq = this.processRecordService.searchRecords(this.selectedProcessDefinitionId, this.applicationId, this.activeFilters, this.pageNumber, this.pageSize);

    forkJoin({
      fieldsData: fieldsReq,
      recordsData: recordsReq
    }).subscribe({
      next: (results: any) => {
        this.processFields = results.fieldsData.fields;
        this.displayColumns = this.processFields.map((f: ProcessField) => f.fieldName);

        this.records = results.recordsData.records;
        this.totalCount = results.recordsData.totalCount;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading data:', err);
        this.loading = false;
      }
    });
  }

  loadRecords(): void {
    if (!this.selectedProcessDefinitionId) return;
    this.loading = true;

    this.processRecordService.searchRecords(this.selectedProcessDefinitionId, this.applicationId, this.activeFilters, this.pageNumber, this.pageSize).subscribe({
      next: (response: any) => {
        this.records = response.records;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading records:', err);
        this.loading = false;
      }
    });
  }

  onFilterApply(filters: any): void {
    this.activeFilters = filters;
    this.pageNumber = 1;
    this.loadRecords();
  }

  onView(recordId: number): void {
    this.selectedRecordId = recordId;
    this.viewEditMode = 'view';
    this.formActive.emit(true);
  }

  onEdit(recordId: number): void {
    this.selectedRecordId = recordId;
    this.viewEditMode = 'edit';
    this.formActive.emit(true);
  }

  onDelete(recordId: number): void {
    if (!this.selectedProcessDefinitionId) return;

    if (confirm('Are you sure you want to delete this record?')) {
      this.processRecordService.deleteRecord(this.selectedProcessDefinitionId, recordId).subscribe({
        next: () => {
          this.toastService.showSuccess('Record deleted successfully');
          this.loadRecords();
        },
        error: (err: any) => {
          console.error('Error deleting record:', err);
          this.toastService.showError(err.error?.message || 'Failed to delete record');
        }
      });
    }
  }

  onFormClose(): void {
    this.viewEditMode = null;
    this.selectedRecordId = null;
    this.formActive.emit(false);
    this.loadRecords();
  }

  onPageChange(event: any): void {
    this.pageNumber = event.skip / event.take + 1;
    this.pageSize = event.take;
    this.loadRecords();
  }
}