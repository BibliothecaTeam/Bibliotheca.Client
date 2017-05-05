import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { GatewayClientService } from '../../services/gateway-client.service';
import { Service } from '../../entities/service';
import { HealthStatus } from "../../entities/health-status";
import { Instance } from "../../entities/instance";

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
            var services:Service[] = result.json();
            this.addBibliothecaServices(services);
        });
    }

    ngOnInit() {
        window.scrollTo(0,0);
    }

    private addBibliothecaServices(services: Service[]) {
        this.services = [];

        for(let service of services) {
            if(service.instances && service.instances.length > 0) {
                
                var isBibliothecaService = false;
                for(let instance of service.instances) {
                    if(instance.tags && instance.tags.includes("bibliotheca")) {
                        isBibliothecaService = true;
                        break;
                    }
                }

                if(isBibliothecaService) {
                    this.services.push(service);
                    continue;
                }
            }
        }
    }

    protected getOutput(instence: Instance) : string {
        var output = instence.healthOuptput;

        var lastIndex = output.lastIndexOf("Output:")
        if(lastIndex >= 0) {
            var information = output.substr(lastIndex + 8, output.length - (lastIndex + 8));
            return  information;
        }

        return "";
    }
}
