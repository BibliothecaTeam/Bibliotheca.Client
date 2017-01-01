import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Authentication } from 'adal-ts';

@Component({
    selector: 'app',
    templateUrl: './app/components/app/app.component.html'
})

export class AppComponent 
{
    public userIsLoggedIn: boolean;

    constructor()
    {
        let context = Authentication.getContext(this.createConfig());
        this.userIsLoggedIn = context.getUser() != null;
        if(this.userIsLoggedIn == false) 
        {
            context.login();
        }
    }

    ngOnInit() 
    {
        Authentication.getAadRedirectProcessor().process();
    }

    private createConfig() : any {
        let config: any = {
            tenant: 'UNIT4.onmicrosoft.com',
            clientId: '6b2d04ca-b3c7-4e45-bf12-e72e7c0b7097',
            postLogoutRedirectUrl: window.location.origin + '/',
            redirectUri: window.location.origin + '/'
        };
        return config;
    }
}