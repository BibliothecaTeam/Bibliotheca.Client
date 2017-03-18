import { Component, Input, Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    @Output() openHomeEvent: EventEmitter<any> = new EventEmitter();
    private hasAccessToSettings: boolean;

    constructor(private header: HeaderService, private router: Router, private jwtHeper: JwtHelper) {
        
        this.hasAccessToSettings = false;
        var token = localStorage["adal.idtoken"];
        if(token) {
            var decoded = this.jwtHeper.decodeToken(token);
            var uniqueName = decoded["unique_name"];
            if(uniqueName && uniqueName.toLowerCase() === "marcin.czachurski@unit4.com") {
                this.hasAccessToSettings = true;
            }
        }

    }

    openHome() {
        this.openHomeEvent.next(null);
        this.router.navigate(['/home']);
    }
}