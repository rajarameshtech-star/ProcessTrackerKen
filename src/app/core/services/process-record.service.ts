// core/services/process-record.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api.constants';
import { ProcessRecord } from '../models/process-record.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessRecordService {
  constructor(private http: HttpClient) { }

  getRecordsByProcess(processId: number, pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<ProcessRecord>> {
    return this.http.get<PaginatedResponse<ProcessRecord>>(
      `${API_BASE_URL}${API_ENDPOINTS.processRecords.getByProcess.replace('{processId}', processId.toString())}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getRecordById(processId: number, recordId: number): Observable<ProcessRecord> {
    return this.http.get<ProcessRecord>(
      `${API_BASE_URL}${API_ENDPOINTS.processRecords.getById
        .replace('{processId}', processId.toString())
        .replace('{recordId}', recordId.toString())}`
    );
  }

  createRecord(processId: number, applicationId: number, data: { fieldValues: { [key: string]: string } }): Observable<ProcessRecord> {
    return this.http.post<ProcessRecord>(
      `${API_BASE_URL}${API_ENDPOINTS.processRecords.create.replace('{processId}', processId.toString())}`,
      data
    );
  }

  updateRecord(processId: number, recordId: number, data: { fieldValues: { [key: string]: string }; notes?: string }): Observable<ProcessRecord> {
    return this.http.put<ProcessRecord>(
      `${API_BASE_URL}${API_ENDPOINTS.processRecords.update
        .replace('{processId}', processId.toString())
        .replace('{recordId}', recordId.toString())}`,
      data
    );
  }

  deleteRecord(processId: number, recordId: number): Observable<void> {
    return this.http.delete<void>(
      `${API_BASE_URL}${API_ENDPOINTS.processRecords.delete
        .replace('{processId}', processId.toString())
        .replace('{recordId}', recordId.toString())}`
    );
  }

  submitRecord(processId: number, recordId: number, data: { notes?: string }): Observable<ProcessRecord> {
    return this.http.post<ProcessRecord>(
      `${API_BASE_URL}${API_ENDPOINTS.processRecords.submit
        .replace('{processId}', processId.toString())
        .replace('{recordId}', recordId.toString())}`,
      data
    );
  }

  searchRecords(processId: number, filters: any, pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<ProcessRecord>> {
    const payload = {
      filters,
      pageNumber,
      pageSize
    };
    return this.http.post<PaginatedResponse<ProcessRecord>>(
      `${API_BASE_URL}${API_ENDPOINTS.processRecords.search.replace('{processId}', processId.toString())}`,
      payload
    );
  }
}