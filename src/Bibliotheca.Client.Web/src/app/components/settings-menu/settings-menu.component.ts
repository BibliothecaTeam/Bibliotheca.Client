import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SearchResults } from '../../entities/search-results';
import { PermissionService } from '../../services/permission.service';
import { Role } from '../../entities/role';

@Component({
    selector: 'app-settings-menu',
    templateUrl: './settings-menu.component.html'
})
export class SettingsMenuComponent {

    @Input()
    public active: string;

    private hasAccessToAccount: boolean = false;
    private hasAccessToProjects: boolean = false;
    private hasAccessToUsers: boolean = false;

    constructor(private permissionService: PermissionService) {

        permissionService.getUserRole().subscribe(role => {

            if(role == Role.User || role == Role.Writer || role == Role.Administrator) {
                this.hasAccessToAccount = true;
                this.hasAccessToProjects = true;
            }

            if(role == Role.Administrator) {
                this.hasAccessToUsers = true;
            }

        });

    }

    private isActive(menuId: string) : string {
        if(this.active == menuId) {
            return "active";
        }

        return "aaaaa";
    }

}