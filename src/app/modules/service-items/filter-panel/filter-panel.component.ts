import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessField } from '../../../core/models/process-field.model';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputsModule, DropDownsModule, DateInputsModule, ButtonsModule],
  templateUrl: './filter-panel.component.html'
})
export class FilterPanelComponent implements OnInit, OnChanges {
  @Input() processFields: ProcessField[] = [];
  @Output() onFilter = new EventEmitter<any>();

  filterForm: FormGroup;
  parsedOptions: { [fieldName: string]: any[] } = {};
  public defaultDropdownItem: { label: string, value: any } = { label: 'All', value: null };

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

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['processFields']) {
      this.buildForm();
    }
  }

  buildForm() {
    const group: any = {};
    if (this.processFields) {
      this.processFields.forEach(field => {
        group[field.fieldName] = [''];
        if (field.fieldType === this.FieldTypeDropdown) {
          try {
            this.parsedOptions[field.fieldName] = JSON.parse(field.optionsJson || '[]');
          } catch {
            this.parsedOptions[field.fieldName] = [];
          }
        }
      });
    }
    this.filterForm = this.fb.group(group);
  }

  // getFieldOptions has been removed as we use parsedOptions directly in the template

  applyFilter() {
    const formValue = this.filterForm.value;
    const activeFilters: any = {};
    for (const key in formValue) {
      if (formValue[key] !== '' && formValue[key] !== null && formValue[key] !== undefined) {
        if (typeof formValue[key] === 'object' && formValue[key].value) { // For dropdowns usually
          activeFilters[key] = formValue[key].value;
        } else if (formValue[key] instanceof Date) {
          activeFilters[key] = formValue[key].toISOString();
        } else {
          activeFilters[key] = formValue[key];
        }
      }
    }
    this.onFilter.emit(activeFilters);
  }

  clearFilter() {
    this.filterForm.reset();
    this.onFilter.emit({});
  }
}
