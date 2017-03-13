import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { Router } from '@angular/router';
import { HttpClientService } from '../../services/http-client.service';
import { ToasterService } from 'angular2-toaster';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html'
})
export class ProjectsComponent {
    
    @Input()
    public projects: Project[];

    @Input()
    public style: string;

    constructor(private httpClient: HttpClientService, private router: Router, private toaster: ToasterService) {
    }

    openDocumentation(id: string) {

        var defaultBranch:string = null;
        for(let project of this.projects) {
            if(project.id == id) {
                defaultBranch = project.defaultBranch;
                break;
            }
        }

        if(!defaultBranch) {
            this.toaster.pop('warning', 'Warning', 'Project doesn\'t have any branches.');
            return;
        }

        this.httpClient.get('/api/projects/' + id + '/branches/' + defaultBranch).subscribe(result => {
            var branch = result.json();
            this.router.navigate(['/docs', id, defaultBranch, branch.docsDir + '/index.md']);
        });
    }
}