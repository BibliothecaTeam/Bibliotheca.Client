import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../model/project';
import { Branch } from '../../model/branch';
import { Router } from '@angular/router';
import { HttpClientService } from '../../services/httpClient.service';

@Component({
    selector: 'projects',
    templateUrl: 'app/components/projects/projects.component.html'
})
export class ProjectsComponent {
    
    @Input()
    public projects: Project[];

    @Input()
    public style: string;

    constructor(private httpClient: HttpClientService, private router: Router) {
    }

    openDocumentation(id: string) {

        var defaultBranch = '';
        for(let project of this.projects) {
            if(project.id == id) {
                defaultBranch = project.defaultBranch;
                break;
            }
        }

        this.httpClient.get('/api/projects/' + id + '/branches/' + defaultBranch).subscribe(result => {
            var branch = result.json();
            this.router.navigate(['/documentation'], { queryParams: { project: id, branch: defaultBranch, docs: branch.docsDir, file: 'index.md' } });
        });
    }
}