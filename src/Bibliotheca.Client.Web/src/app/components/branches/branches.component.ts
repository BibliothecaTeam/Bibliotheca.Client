import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { HttpClientService } from '../../services/http-client.service';

@Component({
    selector: 'app-branches',
    templateUrl: './branches.component.html'
})
export class BranchesComponent {
    
    @Input()
    public project: Project;

    public branches: Branch[];

    constructor(private httpClient: HttpClientService) {
        this.httpClient = httpClient;
    }

    ngOnInit() {
        this.httpClient.get('/api/projects/' + this.project.id + '/branches').subscribe(result => {

            var branches:Branch[] = result.json();
            this.branches = [];

            for(var item of branches) {
                if(this.isOnVisibleBranches(item.name)) {
                    this.branches.push(item);
                }
            }

        });
    }

    private isOnVisibleBranches(branchName: string) : boolean {
        return this.project.visibleBranches.indexOf(branchName) >= 0;
    }
}