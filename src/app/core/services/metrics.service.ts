import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardMetrics } from '../models/dashboard-metrics.model';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
    providedIn: 'root'
})
export class MetricsService {
    private apiUrl = `${API_BASE_URL}/metrics`;

    constructor(private http: HttpClient) { }

    getDashboardMetrics(): Observable<DashboardMetrics> {
        return this.http.get<DashboardMetrics>(`${this.apiUrl}/dashboard`);
    }
}
