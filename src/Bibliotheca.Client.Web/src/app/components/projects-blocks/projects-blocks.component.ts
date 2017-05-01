import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { Router } from '@angular/router';
import { GatewayClientService } from '../../services/gateway-client.service';
import { ToasterService } from 'angular2-toaster';

@Component({
    selector: 'app-projects-blocks',
    templateUrl: './projects-blocks.component.html'
})
export class ProjectsBlocksComponent {
    
    @Input()
    public projects: Project[];

    @Input()
    public style: string;

    constructor(private gatewayClient: GatewayClientService, private router: Router, private toaster: ToasterService) {
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

        this.gatewayClient.getBranch(id, defaultBranch).subscribe(result => {
            var branch = result.json();
            this.router.navigate(['/docs', id, defaultBranch, branch.docsDir + '/index.md']);
        });
    }
}