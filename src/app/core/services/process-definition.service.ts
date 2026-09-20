// core/services/process-definition.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api.constants';
import { ProcessDefinition } from '../models/process-definition.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessDefinitionService {
  private baseUrl = `${API_BASE_URL}${API_ENDPOINTS.processDefinitions.getAll}`;

  constructor(private http: HttpClient) { }

  getAllProcessDefinitions(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<ProcessDefinition>> {
    return this.http.get<PaginatedResponse<ProcessDefinition>>(
      `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getAllActiveProcessDefinitions(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<ProcessDefinition>> {
    return this.http.get<PaginatedResponse<ProcessDefinition>>(
      `${API_BASE_URL}${API_ENDPOINTS.processDefinitions.getActive}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getProcessDefinitionById(id: number): Observable<ProcessDefinition> {
    return this.http.get<ProcessDefinition>(
      `${API_BASE_URL}${API_ENDPOINTS.processDefinitions.getById.replace('{id}', id.toString())}`
    );
  }

  getProcessDefinitionStructure(processId: number): Observable<any> {
    return this.http.get<any>(
      `${API_BASE_URL}${API_ENDPOINTS.processes.getDefinition.replace('{processId}', processId.toString())}`
    );
  }

  createProcessDefinition(data: { code: string; name: string; description: string }): Observable<ProcessDefinition> {
    return this.http.post<ProcessDefinition>(
      `${API_BASE_URL}${API_ENDPOINTS.processDefinitions.create}`,
      data
    );
  }

  updateProcessDefinition(id: number, data: { name: string; description: string; isActive: boolean }): Observable<ProcessDefinition> {
    return this.http.put<ProcessDefinition>(
      `${API_BASE_URL}${API_ENDPOINTS.processDefinitions.update.replace('{id}', id.toString())}`,
      data
    );
  }

  deleteProcessDefinition(id: number): Observable<void> {
    return this.http.delete<void>(
      `${API_BASE_URL}${API_ENDPOINTS.processDefinitions.delete.replace('{id}', id.toString())}`
    );
  }

  toggleActiveStatus(id: number): Observable<ProcessDefinition> {
    return this.http.patch<ProcessDefinition>(
      `${API_BASE_URL}${API_ENDPOINTS.processDefinitions.toggleStatus.replace('{id}', id.toString())}`,
      {}
    );
  }
}