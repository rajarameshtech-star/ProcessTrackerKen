import { Component } from '@angular/core';
import { ApplicationListComponent } from './application-list/application-list.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [ApplicationListComponent],
  templateUrl: './applications.component.html'
})
export class ApplicationsComponent { }
