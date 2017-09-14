import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { GatewayClientService } from '../../services/gateway-client.service';
import { Service } from '../../entities/service';
import { ServiceHealth } from '../../entities/service-health';
import { Observable } from 'rxjs/Observable';

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

    protected refreshServicesState() {
        this.services = null;
        this.gatewayClient.getServices().subscribe(result => {
            this.services = result.json();
        });
    }

    protected isPassing(serviceId: string) : Observable<boolean> {

        return new Observable(observer => {
            this.gatewayClient.getServiceHealth(serviceId).subscribe(result => {
                var serviceHealth: ServiceHealth = result.json();
                observer.next(false);
                observer.complete();
            });
        });
    }

    ngOnInit() {
        window.scrollTo(0,0);
    }
}
