import { OnInit, Component } from "@angular/core";
import { HeaderService } from "../../services/header.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { GatewayClientService } from "../../services/gateway-client.service";
import { ToasterService } from "angular2-toaster";
import { Group } from "../../entities/group";
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'app-group-info',
    templateUrl: './group-info.page.html'
})
export class GroupInfoPage implements OnInit {

    protected group: Group;
    protected isEditMode: Boolean = false;

    constructor(
        private header: HeaderService,
        private route: ActivatedRoute,
        private gatewayClient: GatewayClientService,
        private toaster: ToasterService,
        private router: Router,
        private sanitizer: DomSanitizer) 
    {
        header.title = "Group";
        this.group = new Group();
    }

    ngOnInit() {
        this.route.params.switchMap((params: Params) => {

            if (params["id"]) {
                return this.gatewayClient.getGroup(params["id"]).map((res: Response) => res.json());
            }
            else {
                return Observable.of(null);
            }
        })
        .subscribe(data => {
            if (data) {
                this.group = data;
                this.isEditMode = true;
            }
        },
          err => console.error(err)
        );
    }

    protected getSvgImage(svgIcon: string) {
        return this.sanitizer.bypassSecurityTrustUrl("data:image/svg+xml;base64," + svgIcon);
    }

    protected onSave() {
        if (this.isEditMode) {
            this.gatewayClient.updateGroup(this.group.name, this.group).subscribe(result => {
                if (result.status == 200) {
                    this.toaster.pop('success', 'Success', 'Group was saved successfully.');
                    this.router.navigate(['/groups']);
                } else {
                    this.toaster.pop('error', 'Error', 'There was an error during saving group.');
                }
            });
        }
        else {
            this.gatewayClient.createGroup(this.group).subscribe(result => {
                if (result.status == 201) {
                    this.toaster.pop('success', 'Success', 'Group was created successfully.');
                    this.router.navigate(['/groups']);
                } else {
                    this.toaster.pop('error', 'Error', 'There was an error during creating group.');
                }
            });
        }
    }

}