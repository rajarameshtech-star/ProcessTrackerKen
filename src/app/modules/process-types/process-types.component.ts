import { Component, ViewChild } from '@angular/core';
import { ProcessDefinitionListComponent } from './process-definition-list/process-definition-list.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-process-types',
  standalone: true,
  imports: [ProcessDefinitionListComponent, ButtonsModule],
  templateUrl: './process-types.component.html',
  styles: [`
    .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .header-title { margin: 0; }
  `]
})
export class ProcessTypesComponent {
  @ViewChild(ProcessDefinitionListComponent) list!: ProcessDefinitionListComponent;

  onCreateNew(): void {
    if (this.list) {
      this.list.openDialog();
    }
  }
}
