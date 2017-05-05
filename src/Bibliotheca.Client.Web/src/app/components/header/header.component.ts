import { Component, Input, Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { PermissionService } from '../../services/permission.service';
import { JwtHelper } from 'angular2-jwt';
import { Role } from '../../entities/role';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    @Output() 
    private openHomeEvent: EventEmitter<any> = new EventEmitter();

    protected hasAccessToAccount: boolean = false;
    protected hasAccessToProjects: boolean = false;
    protected hasAccessToUsers: boolean = false;
    protected hasAccessToServices: boolean = false;

    constructor(protected header: HeaderService, private router: Router, private permissionService: PermissionService) {
        
        permissionService.getUserRole().subscribe(role => {

            if(role == Role.User || role == Role.Writer || role == Role.Administrator) {
                this.hasAccessToAccount = true;
                this.hasAccessToProjects = true;
            }

            if(role == Role.Administrator) {
                this.hasAccessToUsers = true;
                this.hasAccessToServices = true;
            }

        });

    }

    openHome() {
        this.openHomeEvent.next(null);
        this.router.navigate(['/home']);
    }
}