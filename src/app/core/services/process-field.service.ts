import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api.constants';
import { ProcessField } from '../models/process-field.model';

@Injectable({
    providedIn: 'root'
})
export class ProcessFieldService {
    constructor(private http: HttpClient) { }

    getFieldsByProcessDefinition(processDefinitionId: number): Observable<ProcessField[]> {
        return this.http.get<ProcessField[]>(
            `${API_BASE_URL}${API_ENDPOINTS.processFields.getByProcessDefinition.replace('{processDefinitionId}', processDefinitionId.toString())}`
        );
    }

    getFieldById(id: number): Observable<ProcessField> {
        return this.http.get<ProcessField>(
            `${API_BASE_URL}${API_ENDPOINTS.processFields.getById.replace('{id}', id.toString())}`
        );
    }

    createField(data: any): Observable<ProcessField> {
        return this.http.post<ProcessField>(
            `${API_BASE_URL}${API_ENDPOINTS.processFields.base}`,
            data
        );
    }

    updateField(id: number, data: any): Observable<ProcessField> {
        return this.http.put<ProcessField>(
            `${API_BASE_URL}${API_ENDPOINTS.processFields.getById.replace('{id}', id.toString())}`,
            data
        );
    }

    toggleActiveStatus(id: number): Observable<ProcessField> {
        return this.http.patch<ProcessField>(
            `${API_BASE_URL}${API_ENDPOINTS.processFields.toggleStatus.replace('{id}', id.toString())}`,
            {}
        );
    }

    deleteField(id: number): Observable<void> {
        return this.http.delete<void>(
            `${API_BASE_URL}${API_ENDPOINTS.processFields.getById.replace('{id}', id.toString())}`
        );
    }
}
