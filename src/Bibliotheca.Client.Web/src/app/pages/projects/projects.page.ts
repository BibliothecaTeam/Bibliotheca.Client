import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { HttpClientService } from '../../services/http-client.service';
import { Project } from '../../entities/project';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html'
})
export class ProjectsPage implements OnInit {

    private projects: Project[];
    private allProjects: Number;

    constructor(private header: HeaderService, private http: HttpClientService, private toaster: ToasterService) { 
        header.title = "Projects";

        http.get('/api/projects').subscribe(result => {
            var json = result.json();
            this.projects = json.results;
            this.allProjects = json.allResults;
        });
    }

    ngOnInit() {
        window.scrollTo(0,0);
    }

    tryDeleteProject(project: Project) {
        project["deletionMode"] = true;
    }

    cancelDeleteProject(project: Project) {
        project["deletionMode"] = false;
    }

    confirmDeleteProject(index: number) {
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
}
