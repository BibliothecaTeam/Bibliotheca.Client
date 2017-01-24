import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
    selector: 'app',
    templateUrl: './app/components/app/app.component.html'
})
export class AppComponent 
{
    constructor(private authorization: AuthorizationService) {
    }
}