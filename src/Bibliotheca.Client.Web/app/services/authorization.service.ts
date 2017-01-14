import { Injectable } from '@angular/core';
import { Authentication } from 'adal-ts';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthorizationService {

    public isUserLoggedIn: boolean;
    public isTokenExpired: boolean;

    constructor(private jwtHeper: JwtHelper){
    }

    public processProviderRedirect() {
        Authentication.getAadRedirectProcessor().process();
    }

    public checkIfUserIsSignedIn() {

        let context = Authentication.getContext(this.createConfig());
        this.isUserLoggedIn = context.getUser() != null;

        if (this.isUserLoggedIn == false) {
            context.login();
        }
        else
        {
            var token = localStorage["adal.idtoken"];
            this.isTokenExpired = this.jwtHeper.isTokenExpired(token);

            if(this.isTokenExpired == true)
            {
                context.login();
            }
        }
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