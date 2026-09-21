import { Component, ViewChild } from '@angular/core';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [ApplicationListComponent, ButtonsModule],
  templateUrl: './applications.component.html',
  styles: [`
    .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .header-title { margin: 0; }
  `]
})
export class ApplicationsComponent {
  @ViewChild(ApplicationListComponent) appList!: ApplicationListComponent;

  onCreateNew(): void {
    if (this.appList) {
      this.appList.openDialog();
    }
  }
}
