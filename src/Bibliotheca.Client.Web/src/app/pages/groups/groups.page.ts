import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { GatewayClientService } from '../../services/gateway-client.service';
import { ServiceHealth } from '../../entities/service-health';
import { Observable } from 'rxjs/Observable';
import { Group } from '../../entities/group';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html'
})
export class GroupsPage implements OnInit {

    protected groups: Group[];

    constructor(private header: HeaderService, private gatewayClient: GatewayClientService, private toaster: ToasterService) { 
        header.title = "Groups";

        this.gatewayClient.getGroups().subscribe(result => {
            this.groups = result.json();
        });
    }

    ngOnInit() {
        window.scrollTo(0,0);
    }

    protected tryDeleteGroup(group: Group) {
        group["deletionMode"] = true;
    }

    protected cancelDeleteGroup(group: Group) {
        group["deletionMode"] = false;
    }

    protected confirmDeleteGroup(index: number) {
        var group = this.groups[index];

        this.gatewayClient.deleteGroup(group.name).subscribe(result => {
            if(result.status == 200) {
                this.toaster.pop('success', 'Success', 'Group was deleted successfully.');
                this.groups.splice(index, 1);
            } else {
                this.toaster.pop('error', 'Error', 'There was an error during deleting group.');
            }
        });
    }
}
