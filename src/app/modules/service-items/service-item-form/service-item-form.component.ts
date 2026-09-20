// modules/service-items/service-item-form/service-item-form.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputsModule, DropDownsModule, DateInputsModule, ButtonsModule],
  templateUrl: './service-item-form.component.html'
})
export class ServiceItemFormComponent implements OnInit, OnChanges {
  @Input() processDefinitionId: number | null = null;
  @Input() recordId: number | null = null;
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;
  processFields: ProcessField[] = [];
  parsedOptions: { [fieldName: string]: any[] } = {};
  public defaultDropdownItem: { label: string, value: any } = { label: '-- Select --', value: null };
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

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['processDefinitionId'] && this.processDefinitionId) {
      this.form = this.fb.group({});
      this.parsedOptions = {};
      this.processFields = [];
      this.loadProcessFields();
    } else if (changes['recordId'] && this.recordId && this.mode !== 'create' && this.processFields.length > 0) {
      this.loadRecord();
    }
  }

  loadProcessFields(): void {
    this.processDefinitionService.getProcessDefinitionStructure(this.processDefinitionId!).subscribe({
      next: (response) => {
        this.processFields = response.fields.sort((a: ProcessField, b: ProcessField) => a.sortOrder - b.sortOrder);
        console.log('Loaded fields:', this.processFields);
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
    this.form = this.fb.group(group);
  }

  loadRecord(): void {
    if (!this.processDefinitionId || !this.recordId) return;

    this.processRecordService.getRecordById(this.processDefinitionId, this.recordId).subscribe({
      next: (record: any) => {
        console.log('Loaded record:', record);

        // Reverse cast string dictionaries logically back to Kendo-compatible types
        const patchedValues: any = {};
        for (const field of this.processFields) {
          const rawValue = record.fieldValues[field.fieldName];
          if (rawValue === undefined || rawValue === null || rawValue === '') {
            patchedValues[field.fieldName] = null;
            continue;
          }

          if (field.fieldType === this.FieldTypeDate || field.fieldType === this.FieldTypeDateTime) {
            patchedValues[field.fieldName] = new Date(rawValue);
          } else if (field.fieldType === this.FieldTypeNumber) {
            patchedValues[field.fieldName] = Number(rawValue);
          } else if (field.fieldType === this.FieldTypeCheckbox) {
            patchedValues[field.fieldName] = rawValue.toString().toLowerCase() === 'true';
          } else {
            patchedValues[field.fieldName] = rawValue;
          }
        }

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



  onSubmitClick(): void {
    if (this.form.invalid) {
      this.toastService.showError('Please fill all required fields');
      return;
    }

    // Convert everything to string
    const stringifiedPayload: any = {};
    for (const key in this.form.value) {
      const val = this.form.value[key];
      if (val instanceof Date) {
        stringifiedPayload[key] = val.toISOString();
      } else if (val === null || val === undefined) {
        stringifiedPayload[key] = '';
      } else {
        stringifiedPayload[key] = String(val);
      }
    }

    if (this.recordId && this.mode === 'edit' && this.processDefinitionId) {
      this.loading = true;
      this.processRecordService.updateRecord(this.processDefinitionId, this.recordId, { fieldValues: stringifiedPayload }).subscribe({
        next: () => {
          this.toastService.showSuccess('Record updated successfully');
          this.onSubmit.emit(stringifiedPayload);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error updating record:', err);
          this.toastService.showError(err.error?.title || 'Failed to update record');
          this.loading = false;
        }
      });
    } else {
      this.onSubmit.emit(stringifiedPayload);
    }
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }
}