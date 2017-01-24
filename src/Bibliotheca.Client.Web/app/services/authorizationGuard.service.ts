import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(private authorization: AuthorizationService) {

    }

    canActivate() {

        if (!this.authorization.userIsSignedIn()) {
            this.authorization.initImplicitFlow();
            return false;
        }

        return true;
    }
}