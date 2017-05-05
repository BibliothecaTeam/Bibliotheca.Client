import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { GatewayClientService } from '../../services/gateway-client.service';
import { Observable } from 'rxjs/Rx';
import { Project } from '../../entities/project';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { PermissionService } from '../../services/permission.service';
import { Role } from '../../entities/role';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html'
})
export class ProjectsPage implements OnInit {

    protected projects: Project[];
    protected allProjects: Number;
    protected hasAccessToAddNewProject: boolean = false;

    constructor(
        private header: HeaderService, 
        private gatewayClient: GatewayClientService, 
        private toaster: ToasterService, 
        private permissionService: PermissionService) 
    { 
        header.title = "Projects";

        this.gatewayClient.getProjects().subscribe(result => {
            var json = result.json();
            this.projects = json.results;
            this.allProjects = json.allResults;
        });

        permissionService.getUserRole().subscribe(role => {

            if(role == Role.Writer || role == Role.Administrator) {
                this.hasAccessToAddNewProject = true;
            }

        });
    }

    ngOnInit() {
        window.scrollTo(0,0);
    }

    protected tryDeleteProject(project: Project) {
        project["deletionMode"] = true;
    }

    protected cancelDeleteProject(project: Project) {
        project["deletionMode"] = false;
    }

    protected confirmDeleteProject(index: number) {
        var project = this.projects[index];

        this.gatewayClient.deleteProject(project.id).subscribe(result => {
            if(result.status == 200) {
                this.toaster.pop('success', 'Success', 'Project was deleted successfully.');
                this.projects.splice(index, 1);
            } else {
                this.toaster.pop('error', 'Error', 'There was an error during deleting project.');
            }
        });
    }

    protected hasAccessToDelete(projectId: string) : Observable<boolean> {
        return this.permissionService.hasAccessToProject(projectId);
    }

    protected hasAccessToEdit(projectId: string) : Observable<boolean> {
        return this.permissionService.hasAccessToProject(projectId);
    }
}
