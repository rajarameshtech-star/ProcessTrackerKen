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
      { path: 'home', loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent) },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'service-items', component: ServiceItemsComponent },
      { path: 'service-items/create', component: ServiceItemCreateComponent },
      { path: 'service-items/:id/view', loadComponent: () => import('./modules/service-items/service-item-detail/service-item-detail.component').then(m => m.ServiceItemDetailComponent) },
      { path: 'process-types', component: ProcessTypesComponent },
      { path: 'process-fields', loadComponent: () => import('./modules/process-fields/process-fields.component').then(m => m.ProcessFieldsComponent) },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'home' }
];