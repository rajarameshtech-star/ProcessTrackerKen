import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../core/services/metrics.service';
import { DashboardMetrics, ProcessMetric } from '../../core/models/dashboard-metrics.model';
import { GridModule } from '@progress/kendo-angular-grid';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, GridModule],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    metrics: DashboardMetrics | null = null;
    loading: boolean = true;

    constructor(private metricsService: MetricsService) { }

    ngOnInit(): void {
        this.loadMetrics();
    }

    loadMetrics(): void {
        this.loading = true;
        this.metricsService.getDashboardMetrics().subscribe({
            next: (data) => {
                this.metrics = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load metrics:', err);
                // Fallback for missing backend mapping currently to mock objects preventing structural UI breaking
                this.metrics = {
                    totalCompletedRecords: 0,
                    totalPendingRecords: 0,
                    totalRecords: 0,
                    completionRate: 0,
                    itemsPastDue: 0,
                    itemsDueToday: 0,
                    itemsDueThisWeek: 0,
                    unassignedItems: 0,
                    priorityCounts: {},
                    processMetrics: []
                };
                this.loading = false;
            }
        });
    }

    getPriorityKeys(): string[] {
        return this.metrics?.priorityCounts ? Object.keys(this.metrics.priorityCounts) : [];
    }
}
