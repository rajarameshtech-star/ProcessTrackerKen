import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ServiceItemFormComponent } from '../service-item-form/service-item-form.component';

@Component({
    selector: 'app-service-item-detail',
    standalone: true,
    imports: [CommonModule, ButtonsModule, ServiceItemFormComponent],
    templateUrl: './service-item-detail.component.html'
})
export class ServiceItemDetailComponent implements OnInit {
    selectedAppId: number | null = null;
    selectedProcDefId: number | null = null;
    recordId: number | null = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.recordId = Number(idParam);
        }

        this.route.queryParams.subscribe(params => {
            if (params['applicationId']) {
                this.selectedAppId = Number(params['applicationId']);
            }
            if (params['processDefinitionId']) {
                this.selectedProcDefId = Number(params['processDefinitionId']);
            }
        });

        if (!this.selectedProcDefId || !this.recordId) {
            this.onFormCancel();
        }
    }

    onFormCancel(): void {
        const queryParams: any = {};
        if (this.selectedAppId) queryParams.applicationId = this.selectedAppId;
        if (this.selectedProcDefId) queryParams.processDefinitionId = this.selectedProcDefId;

        this.router.navigate(['/service-items'], { queryParams });
    }
}
