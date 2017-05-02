import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { GatewayClientService } from '../../services/gateway-client.service';
import { Service } from '../../entities/service';
import { HealthStatus } from "../../entities/health-status";

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html'
})
export class ServicesPage implements OnInit {

    protected services: Service[];

    constructor(private header: HeaderService, private gatewayClient: GatewayClientService) { 
        header.title = "Services";
        this.refreshServicesState();
    }

    protected isPassing(healthStatus: HealthStatus) {
        return healthStatus == HealthStatus.Passing;
    }

    protected refreshServicesState() {
        this.services = null;
        this.gatewayClient.getServices().subscribe(result => {
            this.services = result.json();
        });
    }

    ngOnInit() {
        window.scrollTo(0,0);
    }
}
