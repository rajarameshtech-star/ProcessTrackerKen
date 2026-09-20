import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ProcessDefinitionService } from '../../../core/services/process-definition.service';
import { ProcessDefinition } from '../../../core/models/process-definition.model';
import { ToastService } from '../../../shared/utils/toast.service';
import { ProcessDefinitionDialogComponent } from '../process-definition-dialog/process-definition-dialog.component';

@Component({
  selector: 'app-process-definition-list',
  standalone: true,
  imports: [CommonModule, GridModule, DialogModule, ButtonsModule, ProcessDefinitionDialogComponent],
  templateUrl: './process-definition-list.component.html'
})
export class ProcessDefinitionListComponent implements OnInit {
  processDefinitions: ProcessDefinition[] = [];
  loading = false;
  pageSize = 20;
  pageNumber = 1;

  isDialogOpen = false;
  selectedDefinition: ProcessDefinition | null = null;
  dialogMode: 'create' | 'edit' = 'create';

  constructor(
    private processDefinitionService: ProcessDefinitionService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProcessDefinitions();
  }

  loadProcessDefinitions(): void {
    this.loading = true;
    this.processDefinitionService.getAllProcessDefinitions(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.processDefinitions = response.records;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading process types:', err);
        this.toastService.showError('Failed to load process types');
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.pageNumber = (event.skip / this.pageSize) + 1;
    this.loadProcessDefinitions();
  }

  openDialog(definition: ProcessDefinition | null = null): void {
    this.selectedDefinition = definition;
    this.dialogMode = definition ? 'edit' : 'create';
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedDefinition = null;
  }

  saveDefinition(data: any): void {
    if (this.dialogMode === 'create') {
      this.processDefinitionService.createProcessDefinition({
        code: data.code,
        name: data.name,
        description: data.description
      }).subscribe({
        next: () => {
          this.toastService.showSuccess('Process created successfully');
          this.closeDialog();
          this.loadProcessDefinitions();
        },
        error: (err) => this.toastService.showError(err.error?.title || 'Error creating process')
      });
    } else if (this.selectedDefinition) {
      this.processDefinitionService.updateProcessDefinition(this.selectedDefinition.id, {
        name: data.name,
        description: data.description,
        isActive: this.selectedDefinition.isActive
      }).subscribe({
        next: () => {
          this.toastService.showSuccess('Process updated successfully');
          this.closeDialog();
          this.loadProcessDefinitions();
        },
        error: (err) => this.toastService.showError(err.error?.title || 'Error updating process')
      });
    }
  }

  toggleActive(definition: ProcessDefinition): void {
    this.processDefinitionService.toggleActiveStatus(definition.id).subscribe({
      next: () => {
        this.toastService.showSuccess(`Process ${definition.isActive ? 'Deactivated' : 'Activated'}`);
        this.loadProcessDefinitions();
      },
      error: () => this.toastService.showError('Error toggling status')
    });
  }

  manageFields(definition: ProcessDefinition): void {
    this.router.navigate(['/process-fields'], { queryParams: { processDefinitionId: definition.id } });
  }
}
