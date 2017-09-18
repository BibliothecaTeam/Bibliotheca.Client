import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { GatewayClientService } from '../../services/gateway-client.service';

@Component({
    selector: 'app-branches',
    templateUrl: './branches.component.html'
})
export class BranchesComponent {
    
    @Input()
    public project: Project;

    public branches: Branch[];

    constructor(private gatewayClient: GatewayClientService) {
    }

    ngOnInit() {
        this.branches = [];
        for(var item of this.project.branches) {
            if(this.isOnVisibleBranches(item.name)) {
                this.branches.push(item);
            }
        }
    }

    protected isOnVisibleBranches(branchName: string) : boolean {
        return this.project.visibleBranches.indexOf(branchName) >= 0;
    }
}