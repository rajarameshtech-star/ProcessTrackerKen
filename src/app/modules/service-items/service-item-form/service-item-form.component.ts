// modules/service-items/service-item-form/service-item-form.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessDefinitionService } from '../../../core/services/process-definition.service';
import { ProcessRecordService } from '../../../core/services/process-record.service';
import { ToastService } from '../../../shared/utils/toast.service';
import { ProcessField } from '../../../core/models/process-field.model';

@Component({
  selector: 'app-service-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TextBoxModule, DropDownsModule, DateInputsModule, ButtonsModule],
  templateUrl: './service-item-form.component.html'
})
export class ServiceItemFormComponent implements OnInit {
  @Input() processDefinitionId: number | null = null;
  @Input() recordId: number | null = null;
  @Input() isEditMode = false;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;
  processFields: ProcessField[] = [];
  loading = false;

  // Field type constants
  readonly FieldTypeText = 0;
  readonly FieldTypeNumber = 1;
  readonly FieldTypeDate = 2;
  readonly FieldTypeDateTime = 3;
  readonly FieldTypeDropdown = 4;
  readonly FieldTypeTextArea = 5;
  readonly FieldTypeCheckbox = 6;
  readonly FieldTypeEmail = 7;
  readonly FieldTypeUrl = 8;
  readonly FieldTypePhone = 9;

  constructor(
    private fb: FormBuilder,
    private processDefinitionService: ProcessDefinitionService,
    private processRecordService: ProcessRecordService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.processDefinitionId) {
      this.loadProcessFields();
    }
  }

  loadProcessFields(): void {
    this.processDefinitionService.getProcessDefinitionStructure(this.processDefinitionId!).subscribe({
      next: (response) => {
        this.processFields = response.fields.sort((a: ProcessField, b: ProcessField) => a.sortOrder - b.sortOrder);
        console.log('Loaded fields:', this.processFields);
        this.buildForm();
        if (this.isEditMode && this.recordId) {
          this.loadRecord();
        }
      },
      error: (err) => {
        console.error('Error loading process fields:', err);
        this.toastService.showError('Failed to load fields');
      }
    });
  }

  buildForm(): void {
    const group: any = {};
    this.processFields.forEach(field => {
      console.log('Building field:', field.fieldName, 'Type:', field.fieldType);
      const validators = field.isRequired ? [Validators.required] : [];
      group[field.fieldName] = ['', validators];
    });
    this.form = this.fb.group(group);
    console.log('Form built with controls:', Object.keys(this.form.controls));
  }

  loadRecord(): void {
    if (!this.processDefinitionId || !this.recordId) return;

    this.processRecordService.getRecordById(this.processDefinitionId, this.recordId).subscribe({
      next: (record) => {
        console.log('Loaded record:', record);
        this.form.patchValue(record.fieldValues);
        if (!this.isEditMode) {
          this.form.disable();
        }
      },
      error: (err) => {
        console.error('Error loading record:', err);
        this.toastService.showError('Failed to load record');
      }
    });
  }

  getFieldOptions(field: ProcessField): any[] {
    try {
      const options = JSON.parse(field.optionsJson || '[]');
      return Array.isArray(options) ? options : [];
    } catch {
      return [];
    }
  }

  onSubmitClick(): void {
    if (this.form.invalid) {
      this.toastService.showError('Please fill all required fields');
      return;
    }

    if (this.recordId && this.isEditMode && this.processDefinitionId) {
      this.loading = true;
      this.processRecordService.updateRecord(this.processDefinitionId, this.recordId, { fieldValues: this.form.value }).subscribe({
        next: () => {
          this.toastService.showSuccess('Record updated successfully');
          this.onSubmit.emit(this.form.value);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error updating record:', err);
          this.toastService.showError(err.error?.title || 'Failed to update record');
          this.loading = false;
        }
      });
    } else {
      this.onSubmit.emit(this.form.value);
    }
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }
}