import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-application-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputsModule, ButtonsModule],
  templateUrl: './application-dialog.component.html',
  styles: [`
    .form-wrapper { display: flex; flex-direction: column; gap: 15px; }
    .field-wrapper { display: flex; flex-direction: column; gap: 5px; }
    .label-weight { font-weight: 500; }
    .text-red { color: red; }
    .error-text { color: red; font-size: 12px; }
    .textarea-border { border: 1px solid #ccc; padding: 8px; border-radius: 4px; }
    .action-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class ApplicationDialogComponent implements OnInit {
  @Input() application: Application | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.application?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.application?.description || '', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
