import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { HttpClientService } from '../../services/http-client.service';

@Component({
    selector: 'branches',
    templateUrl: './branches.component.html'
})
export class BranchesComponent {
    
    @Input()
    public projectId: string;

    public branches: Branch[];

    constructor(private httpClient: HttpClientService) {
        this.httpClient = httpClient;
    }

    ngOnInit() {
        this.httpClient.get('/api/projects/' + this.projectId + '/branches').subscribe(result => {
            this.branches = result.json();
        });
    }
}