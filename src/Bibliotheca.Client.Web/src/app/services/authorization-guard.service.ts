import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthorizationService } from './authorization.service';
import { PermissionService } from './permission.service';
import { Role } from '../entities/role';

@Injectable()
export class AuthorizationGuardService implements CanActivate {

    constructor(private authorization: AuthorizationService, private permissionService: PermissionService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot) : any {

        if (!this.authorization.userIsSignedIn()) {
            this.authorization.initImplicitFlow();
            return false;
        }

        return this.permissionService.getUserRole().map(role => {

            var hasAccess = false;
            switch(route.routeConfig.path) {
                case "account": 
                    hasAccess = (role == Role.User || role == Role.Writer || role == Role.Administrator);
                    break;
                case "projects":
                    hasAccess = (role == Role.User || role == Role.Writer || role == Role.Administrator);
                    break;
                case "users":
                    hasAccess = (role == Role.Administrator);
                    break;
                default:
                    hasAccess = true;
            }

            if(!hasAccess) {
                this.router.navigate(['/forbidden']);
                return false;
            }

            return true;
        });
    }
}