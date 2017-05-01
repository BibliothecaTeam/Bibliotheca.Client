import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { GatewayClientService } from '../../services/gateway-client.service';
import { ToasterService } from 'angular2-toaster';
import { User } from '../../entities/user';
import { Role } from '../../entities/role';
import { PermissionService } from '../../services/permission.service';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.page.html'
})
export class UserInfoPage implements OnInit {

    private user: User;
    private roles: string[];
    private isEditMode: Boolean;
    private projectNameRequired: Boolean;
    private projectNameExists: Boolean;
    private canEditUser: Boolean = false;

    constructor(
        private header: HeaderService,
        private route: ActivatedRoute,
        private gatewayClient: GatewayClientService,
        private toaster: ToasterService,
        private router: Router,
        private permissionService: PermissionService) {
        
        header.title = "User";
        this.user = new User();
        this.user.role = "User";
        this.isEditMode = false;

        this.roles = [];
        this.roles.push("User");
        this.roles.push("Writer");
        this.roles.push("Administrator");
    }

    ngOnInit() {

        this.route.params
            .switchMap((params: Params) => {

                this.canEditUser = false;
                this.permissionService.getUserRole().subscribe(role => {
                    if(role == Role.Administrator) {
                        this.canEditUser = true;
                    }
                });

                if (params["id"]) {
                    return this.gatewayClient.getUser(params["id"]).map((res: Response) => res.json());
                }
                else {
                    return Observable.of(null);
                }
            })
            .subscribe(data => {
                if (data) {
                    this.user = data;
                    this.isEditMode = true;
                }
            },
              err => console.error(err)
            );
    }

    addProject(name: HTMLInputElement) {

        if (!this.user.projects) {
            this.user.projects = [];
        }

        if(name.value == "") {
            this.projectNameRequired = true;
            return;
        }

        if(this.user.projects.indexOf(name.value) >= 0) {
            this.projectNameExists = true;
            return;
        }

        this.user.projects.push(name.value);

        this.projectNameRequired = false;
        this.projectNameExists = false;
        name.value = null;
    }

    changeProjectName(event: any) {
        this.projectNameRequired = false;
        this.projectNameExists = false;
    }

    deleteProject(index: number) {
        this.user.projects.splice(index, 1);
    }

    onSave() {
        if (this.isEditMode) {
            this.gatewayClient.updateUser(this.user.id, this.user).subscribe(result => {
                if (result.status == 200) {
                    this.permissionService.clearUser();
                    this.toaster.pop('success', 'Success', 'User was saved successfully.');
                    this.router.navigate(['/users']);
                } else {
                    this.toaster.pop('error', 'Error', 'There was an error during saving user.');
                }
            });
        }
        else {
            this.user.id = this.user.id.toLowerCase();
            this.gatewayClient.createUser(this.user).subscribe(result => {
                if (result.status == 201) {
                    this.permissionService.clearUser();
                    this.toaster.pop('success', 'Success', 'User was created successfully.');
                    this.router.navigate(['/users']);
                } else {
                    this.toaster.pop('error', 'Error', 'There was an error during creating user.');
                }
            });
        }
    }
}
