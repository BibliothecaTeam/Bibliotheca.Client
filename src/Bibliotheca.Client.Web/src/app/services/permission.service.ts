import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClientService } from './http-client.service';
import { JwtHelper } from 'angular2-jwt';
import { Role } from '../entities/role';
import { User } from '../entities/user';

@Injectable()
export class PermissionService {
    
    private user : User;

    constructor(private http: HttpClientService, private jwtHeper: JwtHelper) {
    }

    public clearUser() {
        this.user = null;
    }

    public hasAccessToProject(projectId: string) : Observable<boolean> {

        return new Observable(observer => {

            if(this.user) {
                let hasAccess = this.hasUserAccessToProject(this.user, projectId);
                observer.next(hasAccess);
                observer.complete();
            }
            else {
                this.downloadUser().subscribe(user => {
                    let hasAccess = this.hasUserAccessToProject(user, projectId);
                    observer.next(hasAccess);
                    observer.complete();
                });
            }
        });
    }

    public getUserRole() : Observable<Role> {

        return new Observable(observer => {

            if(this.user) {
                let role = this.convertRoleToEnum(this.user.role);
                observer.next(role);
                observer.complete();
            }
            else {
                this.downloadUser().subscribe(user => {
                    let role = this.convertRoleToEnum(user.role);
                    observer.next(role);
                    observer.complete();
                });
            }

        });
    }

    private hasUserAccessToProject(user: User, projectId: string) : boolean {

        let role = this.convertRoleToEnum(user.role);
        if(role == Role.Administrator) {
            return true;
        }

        if(this.user.projects && this.user.projects.indexOf(projectId) > -1) {
            return true;
        }
        
        return false;
    }

    private convertRoleToEnum(role: string) : Role {
        switch(role)
        {
            case "User":
                return Role.User;
            case "Writer":
                return Role.Writer;
            case "Administrator":
                return Role.Administrator;
            default:
                return Role.Unknown;
        }
    }

    private downloadUser() : Observable<User> {

        return new Observable(observer => {

            var token = localStorage["adal.idtoken"];
            if(token) {
                var decoded = this.jwtHeper.decodeToken(token);
                var uniqueName = decoded["unique_name"];
                
                var userId = uniqueName.toLowerCase();
                this.http.get('/api/users/' + userId).subscribe(
                    result => {
                        this.user = result.json();
                        observer.next(this.user);
                        observer.complete();
                    },
                    error => {
                        this.user = new User();
                        this.user.id = userId;
                        this.user.role = "Unknown";
                    }
                );
            }
            else {
                this.user = new User();
                observer.next(this.user);
                observer.complete();
            }

        });
    }
}