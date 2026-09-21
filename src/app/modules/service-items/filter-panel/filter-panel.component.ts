import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessField } from '../../../core/models/process-field.model';
import { ProcessRecordService } from '../../../core/services/process-record.service';

import { LayoutModule } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputsModule, DropDownsModule, DateInputsModule, ButtonsModule, LayoutModule],
  templateUrl: './filter-panel.component.html'
})
export class FilterPanelComponent implements OnInit, OnChanges {
  @Input() processFields: ProcessField[] = [];
  @Input() processDefinitionId: number | null = null;
  @Output() onFilter = new EventEmitter<any>();

  filterForm: FormGroup;
  parsedOptions: { [fieldName: string]: any[] } = {};
  public defaultDropdownItem: { label: string, value: any } = { label: 'All', value: null };
  isExpanded: boolean = false;

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

  priorities: string[] = [];
  defaultPriorityItem: string = 'All Priorities';

  statuses: string[] = ['Draft', 'Submitted'];
  defaultStatusItem: string = 'All Statuses';

  constructor(private fb: FormBuilder, private processRecordService: ProcessRecordService) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['processFields'] && this.processFields) {
      this.buildForm();
    }
    if (changes['processDefinitionId'] && this.processDefinitionId) {
      this.loadPriorities();
    }
  }

  loadPriorities() {
    if (!this.processDefinitionId) return;
    this.processRecordService.getPriorities(this.processDefinitionId).subscribe({
      next: (res) => this.priorities = res,
      error: (err) => console.error('Failed to load priorities', err)
    });
  }

  buildForm() {
    const group: any = {};
    if (this.processFields) {
      this.processFields.forEach(field => {
        if (field.fieldType === this.FieldTypeNumber) {
          group[field.fieldName] = this.fb.group({ min: [null], max: [null] });
        } else if (field.fieldType === this.FieldTypeDate || field.fieldType === this.FieldTypeDateTime) {
          group[field.fieldName] = this.fb.group({ startDate: [null], endDate: [null] });
        } else {
          group[field.fieldName] = [''];
          if (field.fieldType === this.FieldTypeDropdown) {
            try {
              this.parsedOptions[field.fieldName] = JSON.parse(field.optionsJson || '[]');
            } catch {
              this.parsedOptions[field.fieldName] = [];
            }
          }
        }
      });
    }

    // Append root base models permanently mapping across filtering natively
    group['recordStatus'] = [null];
    group['priority'] = [null];
    group['expectedDueDate'] = [null];
    group['assignedTo'] = [''];

    this.filterForm = this.fb.group(group);
  }

  // getFieldOptions has been removed as we use parsedOptions directly in the template

  toggleAccordion() {
    this.isExpanded = !this.isExpanded;
  }

  applyFilter() {
    const formValue = this.filterForm.value;
    const dynamicFilters: any = {};
    const payload: any = { filters: dynamicFilters };

    for (const key in formValue) {
      if (formValue[key] !== '' && formValue[key] !== null && formValue[key] !== undefined && formValue[key] !== 'All Priorities' && formValue[key] !== 'All Statuses') {

        // Isolate Base Properties safely mapped cleanly towards root payload execution
        if (key === 'recordStatus' || key === 'priority' || key === 'expectedDueDate' || key === 'assignedTo') {
          if (formValue[key] instanceof Date) {
            payload[key] = formValue[key].toISOString();
          } else {
            payload[key] = formValue[key];
          }
          continue;
        }

        // Map Range Bounds safely natively escaping explicitly without object prototype conflicts
        if (typeof formValue[key] === 'object' && ('min' in formValue[key] || 'startDate' in formValue[key])) {
          const rangeObj: any = {};
          let isActiveBounds = false;

          if (formValue[key].min !== null && formValue[key].min !== undefined) { rangeObj.min = formValue[key].min; isActiveBounds = true; }
          if (formValue[key].max !== null && formValue[key].max !== undefined) { rangeObj.max = formValue[key].max; isActiveBounds = true; }
          if (formValue[key].startDate) { rangeObj.startDate = (formValue[key].startDate instanceof Date) ? formValue[key].startDate.toISOString() : formValue[key].startDate; isActiveBounds = true; }
          if (formValue[key].endDate) { rangeObj.endDate = (formValue[key].endDate instanceof Date) ? formValue[key].endDate.toISOString() : formValue[key].endDate; isActiveBounds = true; }

          if (isActiveBounds) dynamicFilters[key] = rangeObj;
        } else if (typeof formValue[key] === 'object' && formValue[key].value) { // For dropdowns usually
          dynamicFilters[key] = formValue[key].value;
        } else if (formValue[key] instanceof Date) {
          dynamicFilters[key] = formValue[key].toISOString();
        } else {
          dynamicFilters[key] = formValue[key];
        }
      }
    }

    this.onFilter.emit(payload);
    // Explicitly collapse the native accordion block instantly after calling the mapping mechanism
    this.isExpanded = false;
  }

  clearFilter() {
    this.filterForm.reset();
    this.onFilter.emit({ filters: {} });
  }
}
