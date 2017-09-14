import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { GatewayClientService } from '../../services/gateway-client.service';
import { ServiceHealth } from '../../entities/service-health';

@Component({
    selector: 'app-service-health',
    templateUrl: './service-health.component.html'
})
export class ServiceHealthComponent {
    
    @Input()
    public serviceId: string;

    public serviceHealth: ServiceHealth;

    constructor(private gatewayClient: GatewayClientService) {
    }

    ngOnInit() {
        this.gatewayClient.getServiceHealth(this.serviceId).subscribe(result => {
            this.serviceHealth = result.json();
        });
    }

    protected getClass() {
        return this.serviceHealth.healthState === "Passing" ? "label label-success" : "label label-danger";
    }
}