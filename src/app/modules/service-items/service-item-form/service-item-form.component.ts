// modules/service-items/service-item-form/service-item-form.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ProcessDefinitionService } from '../../../core/services/process-definition.service';
import { ProcessRecordService } from '../../../core/services/process-record.service';
import { ToastService } from '../../../shared/utils/toast.service';
import { ProcessField } from '../../../core/models/process-field.model';
import { ProcessRecord } from '../../../core/models/process-record.model';

@Component({
  selector: 'app-service-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputsModule, DropDownsModule, DateInputsModule, ButtonsModule, DialogModule],
  templateUrl: './service-item-form.component.html'
})
export class ServiceItemFormComponent implements OnInit, OnChanges {
  @Input() processDefinitionId: number | null = null;
  @Input() recordId: number | null = null;
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() hideDefaultCancel = false;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;
  processFields: ProcessField[] = [];
  parsedOptions: { [fieldName: string]: any[] } = {};
  public defaultDropdownItem: { label: string, value: any } = { label: '-- Select --', value: null };
  loading = false;

  loadedRecord: ProcessRecord | null = null;
  isSubmitDialogOpen = false;
  submitNotes = '';

  priorities: string[] = [];
  defaultPriorityItem: string = 'Select Priority';

  serverErrors: { [key: string]: string } = {};

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
    this.form = this.fb.group({
      priority: [null],
      expectedDueDate: [null],
      assignedTo: ['']
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['processDefinitionId'] && this.processDefinitionId) {
      this.form = this.fb.group({
        priority: [null],
        expectedDueDate: [null],
        assignedTo: ['']
      });
      this.parsedOptions = {};
      this.processFields = [];

      this.processRecordService.getPriorities(this.processDefinitionId).subscribe({
        next: (res) => this.priorities = res,
        error: (err) => console.error('Failed to load priorities', err)
      });

      this.loadProcessFields();
    } else if (changes['recordId'] && this.recordId && this.mode !== 'create' && this.processFields.length > 0) {
      this.loadRecord();
    }
  }

  loadProcessFields(): void {
    this.processDefinitionService.getProcessDefinitionStructure(this.processDefinitionId!).subscribe({
      next: (response) => {
        // Render all dynamically mapped process fields independently regardless of system properties!
        this.processFields = response.fields
          .sort((a: ProcessField, b: ProcessField) => a.sortOrder - b.sortOrder);

        console.log('Loaded filtered fields:', this.processFields);
        this.buildForm();
        if (this.mode !== 'create' && this.recordId) {
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
      const validators = field.isRequired ? [Validators.required] : [];
      let defaultValue = null;
      group[field.fieldName] = [defaultValue, validators];

      if (field.fieldType === this.FieldTypeDropdown) {
        try {
          this.parsedOptions[field.fieldName] = JSON.parse(field.optionsJson || '[]');
        } catch {
          this.parsedOptions[field.fieldName] = [];
        }
      }
    });

    group['priority'] = [null, [Validators.required]];
    group['expectedDueDate'] = [null];
    group['assignedTo'] = [''];

    this.form = this.fb.group(group);
  }

  loadRecord(): void {
    if (!this.processDefinitionId || !this.recordId) return;

    this.processRecordService.getRecordById(this.processDefinitionId, this.recordId).subscribe({
      next: (record: any) => {
        console.log('Loaded record:', record);
        this.loadedRecord = record;

        // Reverse cast string dictionaries logically back to Kendo-compatible types
        const patchedValues: any = {};
        for (const field of this.processFields) {
          const rawValue = record.fieldValues[field.fieldName];
          if (rawValue === undefined || rawValue === null || rawValue === '') {
            patchedValues[field.fieldName] = null;
            continue;
          }

          if (field.fieldType === this.FieldTypeDate || field.fieldType === this.FieldTypeDateTime) {
            patchedValues[field.fieldName] = (rawValue && !isNaN(Date.parse(rawValue))) ? new Date(rawValue) : null;
          } else if (field.fieldType === this.FieldTypeNumber) {
            patchedValues[field.fieldName] = Number(rawValue);
          } else if (field.fieldType === this.FieldTypeCheckbox) {
            patchedValues[field.fieldName] = rawValue.toString().toLowerCase() === 'true';
          } else {
            patchedValues[field.fieldName] = rawValue;
          }
        }

        // Apply exactly isolated System Properties!
        patchedValues['priority'] = record.priority;
        patchedValues['expectedDueDate'] = record.expectedDueDate ? new Date(record.expectedDueDate) : null;
        patchedValues['assignedTo'] = record.assignedTo || '';

        this.form.patchValue(patchedValues);

        if (this.mode === 'view') {
          this.form.disable();
        }
      },
      error: (err) => {
        console.error('Error loading record:', err);
        this.toastService.showError('Failed to load record');
      }
    });
  }

  getServerError(fieldName: string): string | null {
    if (!this.serverErrors || !fieldName) return null;
    const lowerKey = fieldName.toLowerCase();
    for (const key in this.serverErrors) {
      if (key.toLowerCase() === lowerKey) {
        return this.serverErrors[key];
      }
    }
    return null;
  }

  public setServerErrors(errors: any) {
    this.serverErrors = {};
    for (const key in errors) {
      const apiError = errors[key];
      this.serverErrors[key] = Array.isArray(apiError) ? apiError[0] : apiError;

      const lowerKey = key.toLowerCase();
      let matchedControlKey = Object.keys(this.form.controls).find(k => k.toLowerCase() === lowerKey);

      if (matchedControlKey) {
        this.form.controls[matchedControlKey].setErrors({ serverError: true });
        this.form.controls[matchedControlKey].markAsTouched();
      }
    }
  }

  onMarkCompletedClick(): void {
    this.submitNotes = '';
    this.isSubmitDialogOpen = true;
  }

  confirmSubmit(): void {
    if (!this.processDefinitionId || !this.recordId) return;
    this.loading = true;

    // According to req: POST /api/processes/{processDefId}/records/{recordId}/submit
    // with { notes: string } payload.
    this.processRecordService.submitRecord(this.processDefinitionId, this.recordId, { notes: this.submitNotes }).subscribe({
      next: (res) => {
        this.toastService.showSuccess('Record marked as completed successfully!');
        if (this.loadedRecord) {
          this.loadedRecord.recordStatus = 'Submitted';
        }
        this.isSubmitDialogOpen = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error submitting record:', err);
        this.toastService.showError(err.error?.message || 'Failed to submit record');
        this.loading = false;
      }
    });
  }

  onSubmitClick(): void {
    this.serverErrors = {}; // Clear errors securely prior to payload hook logic
    if (this.form.invalid) {
      const invalidFields: string[] = [];
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors = this.form.get(key)?.errors;
        if (controlErrors) {
          invalidFields.push(key);
          console.warn(`Form Field Invalid -> ${key}: `, controlErrors);
        }
      });
      console.warn('Current form values:', this.form.value);

      this.form.markAllAsTouched();
      this.toastService.showError(`Missing required fields: ${invalidFields.join(', ')}`);
      return;
    }

    const fieldValues: any = {};
    const rootPayload: any = {};

    for (const key in this.form.value) {
      const val = this.form.value[key];

      if (key === 'priority' || key === 'expectedDueDate' || key === 'assignedTo') {
        const strVal = (val instanceof Date) ? val.toISOString() : (val === null || val === undefined ? '' : String(val));
        rootPayload[key] = strVal;
        continue;
      }

      if (val instanceof Date) {
        fieldValues[key] = val.toISOString();
      } else if (val === null || val === undefined) {
        fieldValues[key] = '';
      } else {
        fieldValues[key] = String(val);
      }
    }

    if (this.form.value['priority'] === 'Select Priority') {
      rootPayload['priority'] = null;
    }

    const finalPayload = { fieldValues, ...rootPayload };

    if (this.recordId && this.mode === 'edit' && this.processDefinitionId) {
      this.loading = true;
      this.processRecordService.updateRecord(this.processDefinitionId, this.recordId, finalPayload).subscribe({
        next: () => {
          this.toastService.showSuccess('Record updated successfully');
          this.onSubmit.emit(finalPayload);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error updating record:', err);
          if (err.status === 400 && err.error && err.error.errors) {
            this.setServerErrors(err.error.errors);
            this.toastService.showError('Validation Failed. Please check the highlighted fields.');
          } else {
            this.toastService.showError(err.error?.title || 'Failed to update record');
          }
          this.loading = false;
        }
      });
    } else {
      this.onSubmit.emit(finalPayload);
    }
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }
}