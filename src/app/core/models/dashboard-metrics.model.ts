export interface DashboardMetrics {
    totalCompletedRecords: number;
    totalPendingRecords: number;
    totalRecords: number;
    completionRate: number;
    itemsPastDue: number;
    itemsDueToday: number;
    itemsDueThisWeek: number;
    unassignedItems: number;
    priorityCounts: {
        [key: string]: number;
    };
    processMetrics: ProcessMetric[];
}

export interface ProcessMetric {
    processDefinitionId: number;
    processName: string;
    processCode: string;
    completedCount: number;
    pendingCount: number;
    priorityHeatmap: {
        [key: string]: number;
    };
}
