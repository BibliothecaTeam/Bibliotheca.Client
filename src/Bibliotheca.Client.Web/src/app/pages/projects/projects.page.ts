import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { HttpClientService } from '../../services/http-client.service';
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

    private projects: Project[];
    private allProjects: Number;
    private hasAccessToAddNewProject: boolean = false;

    constructor(private header: HeaderService, private http: HttpClientService, private toaster: ToasterService, private permissionService: PermissionService) { 
        header.title = "Projects";

        http.get('/api/projects').subscribe(result => {
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

    private tryDeleteProject(project: Project) {
        project["deletionMode"] = true;
    }

    private cancelDeleteProject(project: Project) {
        project["deletionMode"] = false;
    }

    private confirmDeleteProject(index: number) {
        var project = this.projects[index];

        this.http.delete("/api/projects/" + project.id).subscribe(result => {
            if(result.status == 200) {
                this.toaster.pop('success', 'Success', 'Project was deleted successfully.');
                this.projects.splice(index, 1);
            } else {
                this.toaster.pop('error', 'Error', 'There was an error during deleting project.');
            }
        });
    }

    private hasAccessToDelete(projectId: string) : Observable<boolean> {
        return this.permissionService.hasAccessToProject(projectId);
    }
}
