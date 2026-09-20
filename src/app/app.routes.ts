// app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ApplicationsComponent } from './modules/applications/applications.component';
import { ServiceItemsComponent } from './modules/service-items/service-items.component';
import { ProcessTypesComponent } from './modules/process-types/process-types.component';
import { ServiceItemCreateComponent } from './modules/service-items/service-item-create/service-item-create.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'applications', component: ApplicationsComponent },
      { path: 'service-items', component: ServiceItemsComponent },
      { path: 'service-items/create', component: ServiceItemCreateComponent },
      { path: 'process-types', component: ProcessTypesComponent },
      { path: '', redirectTo: 'applications', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'applications' }
];