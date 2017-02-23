import { Component, Input, Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';

@Component({
    selector: 'header-component',
    templateUrl: 'app/components/header/header.component.html'
})
export class HeaderComponent {

    @Output() openHomeEvent: EventEmitter<any> = new EventEmitter();

    constructor(private header: HeaderService, private router: Router) {
    }

    openHome() {
        this.openHomeEvent.next(null);
        this.router.navigate(['/home']);
    }
}