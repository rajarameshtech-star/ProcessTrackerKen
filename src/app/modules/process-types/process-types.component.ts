import { Component } from '@angular/core';
import { ProcessDefinitionListComponent } from './process-definition-list/process-definition-list.component';

@Component({
  selector: 'app-process-types',
  standalone: true,
  imports: [ProcessDefinitionListComponent],
  templateUrl: './process-types.component.html'
})
export class ProcessTypesComponent { }
