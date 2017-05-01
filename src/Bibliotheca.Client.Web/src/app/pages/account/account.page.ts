import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { GatewayClientService } from '../../services/gateway-client.service';
import { ToasterService } from 'angular2-toaster';
import { User } from '../../entities/user';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html'
})
export class AccountPage implements OnInit {

    private user: User;
    private roles: string[];
    private isEditMode: Boolean;

    constructor(
        private header: HeaderService,
        private route: ActivatedRoute,
        private gatewayClient: GatewayClientService,
        private toaster: ToasterService,
        private router: Router,
        private jwtHeper: JwtHelper) {
        
        header.title = "My account";
        this.user = new User();
        this.isEditMode = false;

        this.roles = [];
        this.roles.push("User");
        this.roles.push("Writer");
        this.roles.push("Administrator");


        var token = localStorage["adal.idtoken"];
        if(token) {
            var decoded = this.jwtHeper.decodeToken(token);
            var uniqueName = decoded["unique_name"];
            
            var userId = uniqueName.toLowerCase();
            this.gatewayClient.getUser(userId).subscribe(result => {
                this.user = result.json();
            });
        }
    }

    ngOnInit() {
    }

    regenerate() {
        
        this.user.accessToken = this.newGuid();
        this.gatewayClient.refreshUserToken(this.user.id, this.user.accessToken).subscribe(result => {
            if (result.status == 200) {
                this.toaster.pop('success', 'Success', 'User was saved successfully.');
            } else {
                this.toaster.pop('error', 'Error', 'There was an error during saving user.');
            }
        });

    }

    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}
