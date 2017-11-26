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
import { Logs } from '../../entities/logs';

@Component({
  selector: 'app-page-logs',
  templateUrl: './logs.page.html'
})
export class LogsPage implements OnInit {

    protected project: Project;
    protected logs: Logs;

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
                    this.gatewayClient.getLogs(params["id"]).map((res: Response) => res.json())
                );
            }
        })
        .subscribe(data => {
            if (data) {
                this.project = data[0];
                this.logs = data[1];

                this.header.title = this.project.name;
            }
        },
            err => console.error(err)
        );
    }

    protected refresh() {
        this.gatewayClient.getLogs(this.project.id).subscribe(result => {
            if (result.status == 200) {
                this.logs = result.json();
            } else {
                this.toaster.pop('error', 'Error', 'Reindexing was not ordered.');
            }
        });
    }
}
