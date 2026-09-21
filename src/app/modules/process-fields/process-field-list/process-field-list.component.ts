import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ProcessFieldService } from '../../../core/services/process-field.service';
import { ProcessField } from '../../../core/models/process-field.model';
import { ToastService } from '../../../shared/utils/toast.service';
import { ProcessFieldDialogComponent } from '../process-field-dialog/process-field-dialog.component';

@Component({
  selector: 'app-process-field-list',
  standalone: true,
  imports: [CommonModule, GridModule, ButtonsModule, DialogModule, ProcessFieldDialogComponent],
  template: `
    <kendo-grid [data]="fields" [loading]="loading">
      
      <kendo-grid-column field="sortOrder" title="Order" [width]="80"></kendo-grid-column>
      <kendo-grid-column field="fieldName" title="API Key" [width]="150"></kendo-grid-column>
      <kendo-grid-column field="label" title="Field Label" [width]="180"></kendo-grid-column>
      
      <kendo-grid-column field="fieldType" title="Data Type" [width]="120">
        <ng-template kendoGridCellTemplate let-dataItem>
          {{ getFieldTypeName(dataItem.fieldType) }}
        </ng-template>
      </kendo-grid-column>
      
      <kendo-grid-column field="isRequired" title="Required" [width]="100">
        <ng-template kendoGridCellTemplate let-dataItem>
          @if(dataItem.isRequired) {
            <span class="badge badge-amber">Required</span>
          } @else {
            <span class="badge badge-default">Optional</span>
          }
        </ng-template>
      </kendo-grid-column>

      <kendo-grid-column title="Actions" [width]="200">
        <ng-template kendoGridCellTemplate let-dataItem>
          <div class="flex-row gap-sm" style="flex-wrap: nowrap;">
            <button kendoButton class="btn-primary-muted" (click)="openDialog(dataItem)">
              Edit
            </button>
            <button kendoButton class="btn-danger-muted" (click)="deleteField(dataItem)">
              Delete
            </button>
          </div>
        </ng-template>
      </kendo-grid-column>
    </kendo-grid>

    @if (isDialogOpen) {
      <kendo-dialog [title]="dialogMode === 'edit' ? 'Edit Field' : 'Create Field'" (close)="closeDialog()" [width]="700">
        <app-process-field-dialog 
          [field]="selectedField" 
          [processDefinitionId]="processDefinitionId"
          (save)="saveField($event)" 
          (cancel)="closeDialog()">
        </app-process-field-dialog>
      </kendo-dialog>
    }
  `
})
export class ProcessFieldListComponent implements OnInit {
  @Input() processDefinitionId!: number;

  fields: ProcessField[] = [];
  loading = false;

  isDialogOpen = false;
  selectedField: ProcessField | null = null;
  dialogMode: 'create' | 'edit' = 'create';

  constructor(
    private processFieldService: ProcessFieldService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadFields();
  }

  loadFields(): void {
    if (!this.processDefinitionId) return;
    this.loading = true;
    this.processFieldService.getFieldsByProcessDefinition(this.processDefinitionId).subscribe({
      next: (data) => {
        this.fields = data;
        this.loading = false;
      },
      error: () => {
        this.toastService.showError('Failed to load fields');
        this.loading = false;
      }
    });
  }

  getFieldTypeName(type: number): string {
    const types = ['Text', 'Number', 'Date', 'DateTime', 'Dropdown', 'TextArea', 'Checkbox', 'Email', 'Url', 'Phone'];
    return types[type] || 'Unknown';
  }

  openDialog(field: ProcessField | null = null): void {
    this.selectedField = field;
    this.dialogMode = field ? 'edit' : 'create';
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedField = null;
  }

  saveField(data: any): void {
    if (this.dialogMode === 'create') {
      this.processFieldService.createField(data).subscribe({
        next: () => {
          this.toastService.showSuccess('Field created successfully');
          this.closeDialog();
          this.loadFields();
        },
        error: (err) => this.toastService.showError(err.error?.title || 'Error creating field')
      });
    } else if (this.selectedField) {
      this.processFieldService.updateField(this.selectedField.id, data).subscribe({
        next: () => {
          this.toastService.showSuccess('Field updated successfully');
          this.closeDialog();
          this.loadFields();
        },
        error: (err) => this.toastService.showError(err.error?.title || 'Error updating field')
      });
    }
  }

  deleteField(field: ProcessField): void {
    if (confirm('Are you sure you want to completely delete this field? This will fail if records are using it!')) {
      this.processFieldService.deleteField(field.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Field deleted');
          this.loadFields();
        },
        error: (err) => this.toastService.showError(err.error?.title || 'Error deleting field (in use?)')
      });
    }
  }
}
