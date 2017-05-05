import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { GatewayClientService } from '../../services/gateway-client.service';
import { Observable } from 'rxjs/Rx';
import { Branch } from '../../entities/branch';
import { Project } from '../../entities/project';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ToasterService } from 'angular2-toaster';
import { PermissionService } from '../../services/permission.service';
import { Role } from '../../entities/role';
import { IndexStatus } from "../../entities/index-status";
import { Subscription } from "rxjs/Subscription";
import { IndexStatusEnum } from "../../entities/index-status-enum";

@Component({
  selector: 'app-page-branches',
  templateUrl: './branches.page.html'
})
export class BranchesPage implements OnInit {

    protected branches: Branch[];
    protected project: Project;
    protected status: { [branchName: string]: IndexStatus; } = { };

    private subscription:Subscription;

    constructor(
        private header: HeaderService, 
        private gatewayClient: GatewayClientService, 
        private toaster: ToasterService, 
        private route: ActivatedRoute,
        private permissionService: PermissionService) 
    { 
        this.header.title = "";
    }

    ngOnInit() {
        window.scrollTo(0,0);

        this.route.params.switchMap((params: Params) => {
            if (params["id"]) {
                return Observable.forkJoin(
                    this.gatewayClient.getProject(params["id"]).map((res: Response) => res.json()),
                    this.gatewayClient.getBranches(params["id"]).map((res: Response) => res.json())
                );
            }
        })
        .subscribe(data => {
            if (data) {
                this.project = data[0];
                this.branches = data[1];

                this.header.title = this.project.name;

                this.subscription = Observable.interval(1000 * 3).subscribe(x => {
                    this.refreshIndexStatuses();
                });
            }
        },
            err => console.error(err)
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    protected refreshIndexStatuses() {

        for(let branch of this.branches) {
            this.gatewayClient.getReindexStatus(this.project.id, branch.name).subscribe(result => {
                if (result.status == 200) {
                    this.status[branch.name] = result.json();
                }
            });
        }

    }

    protected reindex(branchName: string) {
        console.log("adads");
        this.gatewayClient.reindexBranch(this.project.id, branchName).subscribe(result => {
            if (result.status == 200) {
                this.toaster.pop('success', 'Success', 'Reindexing was ordered successfully.');
            } else {
                this.toaster.pop('error', 'Error', 'Reindexing was not ordered.');
            }
        });
    }

    protected isDuringIndexing(indexStatus:IndexStatusEnum) : boolean {
        return indexStatus === IndexStatusEnum.Indexing;
    }

    protected tryDeleteBranch(branch: Branch) {
        branch["deletionMode"] = true;
    }

    protected cancelDeleteBranch(branch: Branch) {
        branch["deletionMode"] = false;
    }

    protected confirmDeleteBranch(index: number) {
        var branch = this.branches[index];

        this.gatewayClient.deleteBranch(this.project.id, branch.name).subscribe(result => {
            if(result.status == 200) {
                this.toaster.pop('success', 'Success', 'Branch was deleted successfully.');
                this.branches.splice(index, 1);
            } else {
                this.toaster.pop('error', 'Error', 'There was an error during deleting branch.');
            }
        });
    }
}
