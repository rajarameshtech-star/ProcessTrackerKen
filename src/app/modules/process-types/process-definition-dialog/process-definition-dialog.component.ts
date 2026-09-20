import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessDefinition } from '../../../core/models/process-definition.model';

@Component({
  selector: 'app-process-definition-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputsModule, ButtonsModule],
  templateUrl: './process-definition-dialog.component.html'
})
export class ProcessDefinitionDialogComponent implements OnInit {
  @Input() processDefinition: ProcessDefinition | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      code: [{ value: this.processDefinition?.code || '', disabled: !!this.processDefinition }, [Validators.required, Validators.maxLength(10)]],
      name: [this.processDefinition?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.processDefinition?.description || '', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      // In edit mode, code remains what it was on the original prop since it's disabled or ignored via getRawValue if needed
      this.save.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
