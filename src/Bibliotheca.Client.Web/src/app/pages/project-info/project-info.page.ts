import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response } from '@angular/http';
import { GatewayClientService } from '../../services/gateway-client.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { Project } from '../../entities/project';
import { ContactPerson } from '../../entities/contact-person';
import { EditLink } from '../../entities/edit-link';
import { ToasterService } from 'angular2-toaster';
import { PermissionService } from '../../services/permission.service';
import { Group } from '../../entities/group';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-project-info',
    templateUrl: './project-info.page.html'
})
export class ProjectInfoPage implements OnInit {

    protected project: Project;
    protected groups: Group[];
    protected isEditMode: Boolean;

    protected visibleBranchNameRequired: Boolean;
    protected visibleBranchNameExists: Boolean;
    protected tagNameRequired: Boolean;
    protected tagNameExists: Boolean;
    protected contactNameRequred: Boolean;
    protected contactEmailRequired: Boolean;
    protected linkNameRequired: Boolean;
    protected linkValueRequired: Boolean;

    constructor(
        private header: HeaderService,
        private route: ActivatedRoute,
        private gatewayClient: GatewayClientService,
        private toaster: ToasterService,
        private router: Router,
        private permissionService: PermissionService,
        private sanitizer: DomSanitizer) {
        
        header.title = "Project";
        this.project = new Project();
        this.isEditMode = false;
    }

    ngOnInit() {

        this.route.params
            .switchMap((params: Params) => {
                if (params["id"]) {

                    return Observable.forkJoin(
                        this.gatewayClient.getProject(params["id"]).map((res: Response) => res.json()),
                        this.gatewayClient.getProjectAccessToken(params["id"]).map((res: Response) => res.json()),
                        this.gatewayClient.getGroups().map((res: Response) => res.json())
                    );
                }
                else {
                    this.project.accessToken = this.newGuid();
                    return this.gatewayClient.getGroups().map((res: Response) => res.json());
                }
            })
            .subscribe(data => {
                if (Array.isArray(data)) {
                    this.project = data[0];
                    this.project.accessToken = data[1].accessToken;
                    this.groups = data[2];
                    this.isEditMode = true;
                }
                else {
                    this.groups = data[0];
                }
            },
                err => console.error(err)
            );

    }

    protected addTag(name: HTMLInputElement) {

        if (!this.project.tags) {
            this.project.tags = [];
        }

        if(name.value == "") {
            this.tagNameRequired = true;
            return;
        }

        if(this.project.tags.indexOf(name.value) >= 0) {
            this.tagNameExists = true;
            return;
        }

        this.project.tags.push(name.value);

        name.value = null;
        this.tagNameRequired = false;
        this.tagNameExists = false;
    }

    protected changeTagName(event: any) {
        this.tagNameRequired = false;
        this.tagNameExists = false;
    }

    protected deleteTag(index: number) {
        this.project.tags.splice(index, 1);
    }

    protected addVisibleBranch(branch: HTMLInputElement) {

        if (!this.project.visibleBranches) {
            this.project.visibleBranches = [];
        }

        if(branch.value == "") {
            this.visibleBranchNameRequired = true;
            return;
        }

        if(this.project.visibleBranches.indexOf(branch.value) >= 0) {
            this.visibleBranchNameExists = true;
            return;
        }

        this.project.visibleBranches.push(branch.value);

        branch.value = null;
        this.visibleBranchNameRequired = false;
        this.visibleBranchNameExists = false;
    }

    protected changeVisibleBranchName(event: any) {
        this.visibleBranchNameRequired = false;
        this.visibleBranchNameExists = false;
    }

    protected deleteVisibleBranch(index: number) {
        this.project.visibleBranches.splice(index, 1);
    }

    protected addPeople(contactName: HTMLInputElement, contactEmail: HTMLInputElement) {

        if (!this.project.contactPeople) {
            this.project.contactPeople = [];
        }

        if(contactName.value == "") {
            this.contactNameRequred = true;
        }

        if(contactEmail.value == "") {
            this.contactEmailRequired = true;
        }

        if(this.contactEmailRequired || this.contactNameRequred) {
            return;
        }

        var people = new ContactPerson();
        people.name = contactName.value;
        people.email = contactEmail.value;

        this.project.contactPeople.push(people);
        contactName.value = null;
        contactEmail.value = null;
        this.contactNameRequred = false;
        this.contactEmailRequired = false;
    }

    protected changeContactName(event: any) {
        this.contactNameRequred = false;
    }

    protected changeContactEmail(event: any) {
        this.contactEmailRequired = false;
    }

    protected deletePeople(index: number) {
        this.project.contactPeople.splice(index, 1);
    }

    protected addLink(linkName: HTMLInputElement, linkValue: HTMLInputElement) {

        if (!this.project.editLinks) {
            this.project.editLinks = [];
        }

        if(linkName.value == "") {
            this.linkNameRequired = true;
        }

        if(linkValue.value == "") {
            this.linkValueRequired = true;
        }

        if(this.linkNameRequired || this.linkValueRequired) {
            return;
        }

        var link = new EditLink();
        link.branchName = linkName.value;
        link.link = linkValue.value;

        this.project.editLinks.push(link);
        linkName.value = null;
        linkValue.value = null;
        this.linkNameRequired = false;
        this.linkValueRequired = false;
    }

    protected changeLinkName(event: any) {
        this.linkNameRequired = false;
    }

    protected changeLinkValue(event: any) {
        this.linkValueRequired = false;
    }

    protected deleteLink(index: number) {
        this.project.editLinks.splice(index, 1);
    }

    protected hasAccessToEdit() : Observable<boolean> {

        if(!this.isEditMode) {
            return new Observable(observer => {
                observer.next(true);
                observer.complete();
            });
        }

        return this.permissionService.hasAccessToProject(this.project.id);
    }

    protected regenerate() {
        this.project.accessToken = this.newGuid();
    }

    protected newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    protected onSave() {
        if (this.isEditMode) {
            this.gatewayClient.updateProject(this.project.id, this.project).subscribe(result => {
                if (result.status == 200) {
                    this.toaster.pop('success', 'Success', 'Project was saved successfully.');
                    this.router.navigate(['/projects']);
                } else {
                    this.toaster.pop('error', 'Error', 'There was an error during saving project.');
                }
            });
        }
        else {
            this.gatewayClient.createProject(this.project).subscribe(result => {
                if (result.status == 201) {
                    this.permissionService.clearUser();
                    this.toaster.pop('success', 'Success', 'Project was created successfully.');
                    this.router.navigate(['/projects']);
                } else {
                    this.toaster.pop('error', 'Error', 'There was an error during creating project.');
                }
            });
        }
    }

    protected getSvgImage(svgIcon: string) {
        return this.sanitizer.bypassSecurityTrustUrl("data:image/svg+xml;base64," + svgIcon);
    }

    protected getGroupItemClass(name: string) {
        if(name === this.project.group) {
            return "group-item selected-item";
        }

        return "group-item";
    }

    protected chooseGroup(name: string) {
        this.project.group = name;
    }
}
