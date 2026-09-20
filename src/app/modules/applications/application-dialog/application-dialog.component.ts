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
  templateUrl: './application-dialog.component.html'
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
