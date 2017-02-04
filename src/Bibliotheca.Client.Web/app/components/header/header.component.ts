import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HeaderService } from '../../services/header.service';
import { Router } from '@angular/router';

@Component({
    selector: 'header-component',
    templateUrl: 'app/components/header/header.component.html'
})
export class HeaderComponent {

    constructor(private header: HeaderService) {
    }
}