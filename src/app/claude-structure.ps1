# PowerShell script to create Angular project structure - CORRECTED
# Run this in the src/app/ directory

$basePath = Get-Location

function Create-Directory {
    param([string]$path)
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created directory: $path"
    }
}

function Create-File {
    param([string]$path, [string]$content)
    if (!(Test-Path $path)) {
        Set-Content -Path $path -Value $content -Force
        Write-Host "Created file: $path"
    }
}

Write-Host "Creating directory structure..."

# Core directories
Create-Directory "$basePath\core\services"
Create-Directory "$basePath\core\models"
Create-Directory "$basePath\core\constants"

# Shared directories
Create-Directory "$basePath\shared\components"
Create-Directory "$basePath\shared\utils"

# Layout directories
Create-Directory "$basePath\layout\header"
Create-Directory "$basePath\layout\sidebar"

# Applications module
Create-Directory "$basePath\modules\applications\application-list"
Create-Directory "$basePath\modules\applications\application-dialog"

# Service Items module
Create-Directory "$basePath\modules\service-items\process-definition-select"
Create-Directory "$basePath\modules\service-items\service-item-create"
Create-Directory "$basePath\modules\service-items\service-item-table"
Create-Directory "$basePath\modules\service-items\filter-panel"
Create-Directory "$basePath\modules\service-items\service-item-form"

# Process Types module
Create-Directory "$basePath\modules\process-types\process-definition-list"
Create-Directory "$basePath\modules\process-types\process-definition-dialog"

Write-Host "Creating files..."

# CORE SERVICES
Create-File "$basePath\core\services\application.service.ts" @"
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) { }
}
"@

Create-File "$basePath\core\services\process-definition.service.ts" @"
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessDefinitionService {
  constructor(private http: HttpClient) { }
}
"@

Create-File "$basePath\core\services\process-record.service.ts" @"
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessRecordService {
  constructor(private http: HttpClient) { }
}
"@

Create-File "$basePath\core\services\http.interceptor.ts" @"
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request);
  }
}
"@

# CORE MODELS
Create-File "$basePath\core\models\application.model.ts" @"
export interface Application {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  processCount: number;
}
"@

Create-File "$basePath\core\models\process-definition.model.ts" @"
export interface ProcessDefinition {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  fieldCount: number;
  recordCount: number;
}
"@

Create-File "$basePath\core\models\process-field.model.ts" @"
export interface ProcessField {
  id: number;
  fieldName: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  sortOrder: number;
  placeholder: string;
  defaultValue: string;
  optionsJson: string;
  minLength: number;
  maxLength: number;
  min: number;
  max: number;
  pattern: string;
}

export enum FieldType {
  Text = 'Text',
  Number = 'Number',
  Date = 'Date',
  DateTime = 'DateTime',
  Dropdown = 'Dropdown',
  TextArea = 'TextArea',
  Checkbox = 'Checkbox',
  Email = 'Email',
  Url = 'Url',
  Phone = 'Phone'
}
"@

Create-File "$basePath\core\models\process-record.model.ts" @"
export interface ProcessRecord {
  id: number;
  applicationId: number;
  processDefinitionId: number;
  recordStatus: string;
  recordNumber: string;
  createdDate: string;
  modifiedDate: string;
  submittedDate: string;
  notes: string;
  fieldValues: { [key: string]: string };
}
"@

Create-File "$basePath\core\models\filter-criteria.model.ts" @"
export interface FilterCriteria {
  filters: { [key: string]: any };
  pageNumber: number;
  pageSize: number;
}
"@

# CORE CONSTANTS
Create-File "$basePath\core\constants\api.constants.ts" @"
export const API_BASE_URL = 'http://localhost:7100/api';

export const API_ENDPOINTS = {
  applications: {
    getAll: '/applications',
    getActive: '/applications/active',
    getById: '/applications/{id}',
    create: '/applications',
    update: '/applications/{id}',
    delete: '/applications/{id}',
    toggleStatus: '/applications/{id}/toggle-status'
  },
  processDefinitions: {
    getAll: '/process-definitions',
    getActive: '/process-definitions/active',
    getById: '/process-definitions/{id}',
    create: '/process-definitions',
    update: '/process-definitions/{id}',
    delete: '/process-definitions/{id}',
    toggleStatus: '/process-definitions/{id}/toggle-status'
  },
  processRecords: {
    getByProcess: '/processes/{processId}/records',
    getById: '/processes/{processId}/records/{recordId}',
    create: '/processes/{processId}/records',
    update: '/processes/{processId}/records/{recordId}',
    delete: '/processes/{processId}/records/{recordId}',
    submit: '/processes/{processId}/records/{recordId}/submit',
    search: '/processes/{processId}/records/search'
  },
  processes: {
    getDefinition: '/processes/{processId}'
  }
};
"@

# SHARED UTILS
Create-File "$basePath\shared\utils\toast.service.ts" @"
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() { }

  showSuccess(message: string): void {
    console.log('Success:', message);
  }

  showError(message: string): void {
    console.log('Error:', message);
  }
}
"@

# LAYOUT COMPONENTS
Create-File "$basePath\layout\layout.component.ts" @"
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent { }
"@

Create-File "$basePath\layout\layout.component.html" @"
<app-header></app-header>
<div style="display: flex; height: calc(100vh - 60px);">
  <app-sidebar></app-sidebar>
  <div style="flex: 1; overflow: auto; padding: 20px;">
    <router-outlet></router-outlet>
  </div>
</div>
"@

Create-File "$basePath\layout\header\header.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent { }
"@

Create-File "$basePath\layout\header\header.component.html" @"
<div style="background-color: #3d3d3d; color: white; padding: 15px 20px; font-size: 20px; font-weight: bold;">
  Process Tracker
</div>
"@

Create-File "$basePath\layout\sidebar\sidebar.component.ts" @"
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent { }
"@

Create-File "$basePath\layout\sidebar\sidebar.component.html" @"
<nav style="width: 200px; background-color: #f5f5f5; padding: 20px; border-right: 1px solid #ddd; height: 100%;">
  <ul style="list-style: none; padding: 0;">
    <li style="margin-bottom: 10px;"><a routerLink="/applications" style="text-decoration: none; color: #333;">Applications</a></li>
    <li style="margin-bottom: 10px;"><a routerLink="/service-items" style="text-decoration: none; color: #333;">Service Items</a></li>
    <li style="margin-bottom: 10px;"><a routerLink="/process-types" style="text-decoration: none; color: #333;">Process Types</a></li>
  </ul>
</nav>
"@

# APPLICATIONS MODULE
Create-File "$basePath\modules\applications\applications.component.ts" @"
import { Component } from '@angular/core';
import { ApplicationListComponent } from './application-list/application-list.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [ApplicationListComponent],
  templateUrl: './applications.component.html'
})
export class ApplicationsComponent { }
"@

Create-File "$basePath\modules\applications\applications.component.html" @"
<h2>Applications</h2>
<app-application-list></app-application-list>
"@

Create-File "$basePath\modules\applications\application-list\application-list.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-application-list',
  standalone: true,
  templateUrl: './application-list.component.html'
})
export class ApplicationListComponent { }
"@

Create-File "$basePath\modules\applications\application-list\application-list.component.html" @"
<p>application-list works!</p>
"@

Create-File "$basePath\modules\applications\application-dialog\application-dialog.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-application-dialog',
  standalone: true,
  templateUrl: './application-dialog.component.html'
})
export class ApplicationDialogComponent { }
"@

Create-File "$basePath\modules\applications\application-dialog\application-dialog.component.html" @"
<p>application-dialog works!</p>
"@

# SERVICE ITEMS MODULE
Create-File "$basePath\modules\service-items\service-items.component.ts" @"
import { Component } from '@angular/core';
import { ProcessDefinitionSelectComponent } from './process-definition-select/process-definition-select.component';
import { ServiceItemCreateComponent } from './service-item-create/service-item-create.component';
import { ServiceItemTableComponent } from './service-item-table/service-item-table.component';

@Component({
  selector: 'app-service-items',
  standalone: true,
  imports: [ProcessDefinitionSelectComponent, ServiceItemCreateComponent, ServiceItemTableComponent],
  templateUrl: './service-items.component.html'
})
export class ServiceItemsComponent { }
"@

Create-File "$basePath\modules\service-items\service-items.component.html" @"
<h2>Service Items</h2>
<app-process-definition-select></app-process-definition-select>
<app-service-item-create></app-service-item-create>
<app-service-item-table></app-service-item-table>
"@

Create-File "$basePath\modules\service-items\process-definition-select\process-definition-select.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-process-definition-select',
  standalone: true,
  templateUrl: './process-definition-select.component.html'
})
export class ProcessDefinitionSelectComponent { }
"@

Create-File "$basePath\modules\service-items\process-definition-select\process-definition-select.component.html" @"
<p>process-definition-select works!</p>
"@

Create-File "$basePath\modules\service-items\service-item-create\service-item-create.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-service-item-create',
  standalone: true,
  templateUrl: './service-item-create.component.html'
})
export class ServiceItemCreateComponent { }
"@

Create-File "$basePath\modules\service-items\service-item-create\service-item-create.component.html" @"
<p>service-item-create works!</p>
"@

Create-File "$basePath\modules\service-items\service-item-table\service-item-table.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-service-item-table',
  standalone: true,
  templateUrl: './service-item-table.component.html'
})
export class ServiceItemTableComponent { }
"@

Create-File "$basePath\modules\service-items\service-item-table\service-item-table.component.html" @"
<p>service-item-table works!</p>
"@

Create-File "$basePath\modules\service-items\filter-panel\filter-panel.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  templateUrl: './filter-panel.component.html'
})
export class FilterPanelComponent { }
"@

Create-File "$basePath\modules\service-items\filter-panel\filter-panel.component.html" @"
<p>filter-panel works!</p>
"@

Create-File "$basePath\modules\service-items\service-item-form\service-item-form.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-service-item-form',
  standalone: true,
  templateUrl: './service-item-form.component.html'
})
export class ServiceItemFormComponent { }
"@

Create-File "$basePath\modules\service-items\service-item-form\service-item-form.component.html" @"
<p>service-item-form works!</p>
"@

# PROCESS TYPES MODULE
Create-File "$basePath\modules\process-types\process-types.component.ts" @"
import { Component } from '@angular/core';
import { ProcessDefinitionListComponent } from './process-definition-list/process-definition-list.component';

@Component({
  selector: 'app-process-types',
  standalone: true,
  imports: [ProcessDefinitionListComponent],
  templateUrl: './process-types.component.html'
})
export class ProcessTypesComponent { }
"@

Create-File "$basePath\modules\process-types\process-types.component.html" @"
<h2>Process Types</h2>
<app-process-definition-list></app-process-definition-list>
"@

Create-File "$basePath\modules\process-types\process-definition-list\process-definition-list.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-process-definition-list',
  standalone: true,
  templateUrl: './process-definition-list.component.html'
})
export class ProcessDefinitionListComponent { }
"@

Create-File "$basePath\modules\process-types\process-definition-list\process-definition-list.component.html" @"
<p>process-definition-list works!</p>
"@

Create-File "$basePath\modules\process-types\process-definition-dialog\process-definition-dialog.component.ts" @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-process-definition-dialog',
  standalone: true,
  templateUrl: './process-definition-dialog.component.html'
})
export class ProcessDefinitionDialogComponent { }
"@

Create-File "$basePath\modules\process-types\process-definition-dialog\process-definition-dialog.component.html" @"
<p>process-definition-dialog works!</p>
"@

# ROOT COMPONENT FILES
Create-File "$basePath\app.routes.ts" @"
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ApplicationsComponent } from './modules/applications/applications.component';
import { ServiceItemsComponent } from './modules/service-items/service-items.component';
import { ProcessTypesComponent } from './modules/process-types/process-types.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'applications', component: ApplicationsComponent },
      { path: 'service-items', component: ServiceItemsComponent },
      { path: 'process-types', component: ProcessTypesComponent },
      { path: '', redirectTo: 'applications', pathMatch: 'full' }
    ]
  }
];
"@

Write-Host "✅ Project structure created successfully!"