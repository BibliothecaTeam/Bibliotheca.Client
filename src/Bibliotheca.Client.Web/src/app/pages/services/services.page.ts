import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { HttpClientService } from '../../services/http-client.service';
import { Service } from '../../entities/service';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html'
})
export class ServicesPage implements OnInit {

    protected services: Service[];

    constructor(private header: HeaderService, private http: HttpClientService) { 
        header.title = "Services";

        http.get('/api/services').subscribe(result => {
            this.services = result.json();
        });
    }

    ngOnInit() {
        window.scrollTo(0,0);
    }
}
