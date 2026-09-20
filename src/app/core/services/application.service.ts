// core/services/application.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api.constants';
import { Application } from '../models/application.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private baseUrl = `${API_BASE_URL}${API_ENDPOINTS.applications.getAll}`;

  constructor(private http: HttpClient) { }

  getAllApplications(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<Application>> {
    return this.http.get<PaginatedResponse<Application>>(
      `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getAllActiveApplications(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<Application>> {
    return this.http.get<PaginatedResponse<Application>>(
      `${API_BASE_URL}${API_ENDPOINTS.applications.getActive}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(
      `${API_BASE_URL}${API_ENDPOINTS.applications.getById.replace('{id}', id.toString())}`
    );
  }

  createApplication(data: { title: string; description: string }): Observable<Application> {
    return this.http.post<Application>(
      `${API_BASE_URL}${API_ENDPOINTS.applications.create}`,
      data
    );
  }

  updateApplication(id: number, data: { title: string; description: string; isActive: boolean }): Observable<Application> {
    return this.http.put<Application>(
      `${API_BASE_URL}${API_ENDPOINTS.applications.update.replace('{id}', id.toString())}`,
      data
    );
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(
      `${API_BASE_URL}${API_ENDPOINTS.applications.delete.replace('{id}', id.toString())}`
    );
  }

  toggleActiveStatus(id: number): Observable<Application> {
    return this.http.patch<Application>(
      `${API_BASE_URL}${API_ENDPOINTS.applications.toggleStatus.replace('{id}', id.toString())}`,
      {}
    );
  }
}