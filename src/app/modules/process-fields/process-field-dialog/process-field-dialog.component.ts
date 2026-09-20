import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ProcessField } from '../../../core/models/process-field.model';

@Component({
    selector: 'app-process-field-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputsModule, ButtonsModule, DropDownsModule],
    template: `
    <form [formGroup]="form" class="k-form k-form-horizontal" [style.display]="'flex'" [style.flex-direction]="'column'" [style.gap.px]="15">
      
      <div [style.display]="'flex'" [style.gap.px]="15">
        <div class="k-form-field" [style.flex]="1" [style.display]="'flex'" [style.flex-direction]="'column'" [style.gap.px]="5">
          <label class="k-label" [style.font-weight]="'500'">Data Key (FieldName) <span [style.color]="'red'" *ngIf="!field">*</span></label>
          <kendo-textbox formControlName="fieldName" placeholder="camelCase key name"></kendo-textbox>
          @if (form.get('fieldName')?.invalid && form.get('fieldName')?.touched) {
            <div [style.color]="'red'" [style.font-size.px]="12">Alphanumeric string required.</div>
          }
        </div>

        <div class="k-form-field" [style.flex]="1" [style.display]="'flex'" [style.flex-direction]="'column'" [style.gap.px]="5">
          <label class="k-label" [style.font-weight]="'500'">Field Type <span [style.color]="'red'">*</span></label>
          <kendo-dropdownlist 
            formControlName="fieldType"
            [data]="fieldTypes"
            textField="text"
            valueField="value"
            [valuePrimitive]="true">
          </kendo-dropdownlist>
        </div>
      </div>

      <div [style.display]="'flex'" [style.gap.px]="15">
        <div class="k-form-field" [style.flex]="2" [style.display]="'flex'" [style.flex-direction]="'column'" [style.gap.px]="5">
          <label class="k-label" [style.font-weight]="'500'">Display Label <span [style.color]="'red'">*</span></label>
          <kendo-textbox formControlName="label" placeholder="Visible Name"></kendo-textbox>
          @if (form.get('label')?.invalid && form.get('label')?.touched) {
            <div [style.color]="'red'" [style.font-size.px]="12">Required.</div>
          }
        </div>
        
        <div class="k-form-field" [style.flex]="1" [style.display]="'flex'" [style.flex-direction]="'column'" [style.gap.px]="5">
          <label class="k-label" [style.font-weight]="'500'">Sort Order</label>
          <kendo-numerictextbox formControlName="sortOrder" [min]="0" [autoCorrect]="true"></kendo-numerictextbox>
        </div>
      </div>

      <div [style.display]="'flex'" [style.gap.px]="15">
        <div class="k-form-field" [style.flex]="1" [style.display]="'flex'" [style.align-items]="'center'" [style.gap.px]="10">
          <input type="checkbox" kendoCheckBox formControlName="isRequired" />
          <label class="k-label" [style.font-weight]="'500'">Is Required?</label>
        </div>
        
        <div class="k-form-field" [style.flex]="2" [style.display]="'flex'" [style.flex-direction]="'column'" [style.gap.px]="5">
          <label class="k-label" [style.font-weight]="'500'">Placeholder</label>
          <kendo-textbox formControlName="placeholder"></kendo-textbox>
        </div>
      </div>

      <!-- Advanced Mapping specific exclusively targeted options layout constraint-->
      <div [style.border-top]="'1px solid #ddd'" [style.padding-top.px]="15">
        <label [style.font-weight]="'600'" [style.margin-bottom.px]="10" [style.display]="'block'">Advanced Config</label>
        
        <div [style.display]="'flex'" [style.gap.px]="15" [style.margin-bottom.px]="15">
          <div class="k-form-field" [style.flex]="1">
            <label class="k-label">Min Range / Length</label>
            <kendo-numerictextbox formControlName="min"></kendo-numerictextbox>
          </div>
          <div class="k-form-field" [style.flex]="1">
            <label class="k-label">Max Range / Length</label>
            <kendo-numerictextbox formControlName="max"></kendo-numerictextbox>
          </div>
        </div>
        
        <div class="k-form-field" [style.display]="'flex'" [style.flex-direction]="'column'" [style.gap.px]="5" *ngIf="form.get('fieldType')?.value === 4">
          <label class="k-label" [style.font-weight]="'500'">Dropdown Options JSON</label>
          <textarea formControlName="optionsJson" placeholder='["Option 1", "Option 2"]' rows="2" 
                    [style.border]="'1px solid #ccc'" [style.padding.px]="8" [style.border-radius.px]="4">
          </textarea>
        </div>
      </div>

    </form>
    
    <div [style.display]="'flex'" [style.justify-content]="'flex-end'" [style.gap.px]="10" [style.margin-top.px]="20">
      <button kendoButton (click)="cancel.emit()">Cancel</button>
      <button kendoButton themeColor="primary" (click)="onSave()">{{ field ? 'Update' : 'Create' }}</button>
    </div>
  `
})
export class ProcessFieldDialogComponent implements OnInit {
    @Input() field: ProcessField | null = null;
    @Input() processDefinitionId!: number;

    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    form!: FormGroup;

    fieldTypes = [
        { text: 'Text', value: 0 },
        { text: 'Number', value: 1 },
        { text: 'Date', value: 2 },
        { text: 'DateTime', value: 3 },
        { text: 'Dropdown', value: 4 },
        { text: 'TextArea', value: 5 },
        { text: 'Checkbox', value: 6 },
        { text: 'Email', value: 7 },
        { text: 'Url', value: 8 },
        { text: 'Phone', value: 9 }
    ];

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            fieldName: [{ value: this.field?.fieldName || '', disabled: !!this.field }, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
            fieldType: [this.field?.fieldType ?? 0, Validators.required],
            label: [this.field?.label || '', Validators.required],
            isRequired: [this.field?.isRequired || false],
            sortOrder: [this.field?.sortOrder || 0],
            placeholder: [this.field?.placeholder || ''],
            min: [this.field?.min || null],
            max: [this.field?.max || null],
            optionsJson: [this.field?.optionsJson || '']
        });
    }

    onSave(): void {
        if (this.form.valid) {
            const payload = {
                ...this.form.getRawValue(),
                processDefinitionId: this.processDefinitionId
            };

            // Clean up empty numbers or advanced traits if undefined
            this.save.emit(payload);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
