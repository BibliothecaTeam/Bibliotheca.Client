import { Injectable } from '@angular/core';
import { GatewayClientService } from "./gateway-client.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class HeaderService {
    public title: string;
    public searchIsEnabled: boolean = null;

    constructor(private gatewayClient:GatewayClientService) {
    }

    public isSearchEnabled() : Observable<boolean> {

        return new Observable(observer => {

            if(this.searchIsEnabled === null) {
                this.gatewayClient.searchIsEnabled().subscribe(result => {
                    var json = result.json();
                    this.searchIsEnabled = json.isAlive;
                    observer.next(this.searchIsEnabled);
                    observer.complete();
                });
            }
            else {
                observer.next(this.searchIsEnabled);
                observer.complete();
            }

        });
    }
}