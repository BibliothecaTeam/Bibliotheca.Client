import { Component, Input, Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { PermissionService } from '../../services/permission.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    @Output() openHomeEvent: EventEmitter<any> = new EventEmitter();
    private hasAccessToSettings: boolean;

    constructor(private header: HeaderService, private router: Router, private permissionService: PermissionService) {
        
        this.hasAccessToSettings = false;
        permissionService.hasAccessToProject("configuration-manager").subscribe(result => {
            this.hasAccessToSettings = result;
        });

    }

    openHome() {
        this.openHomeEvent.next(null);
        this.router.navigate(['/home']);
    }
}