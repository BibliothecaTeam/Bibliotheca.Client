import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response } from '@angular/http';
import { HttpClientService } from '../../services/http-client.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { Project } from '../../entities/project';
import { ContactPerson } from '../../entities/contact-person';
import { EditLink } from '../../entities/edit-link';
import { ToasterService } from 'angular2-toaster';

@Component({
    selector: 'app-project-info',
    templateUrl: './project-info.page.html'
})
export class ProjectInfoPage implements OnInit {

    private project: Project;
    private isEditMode: Boolean;

    constructor(
        private header: HeaderService,
        private route: ActivatedRoute,
        private http: HttpClientService,
        private toaster: ToasterService,
        private router: Router) {
        
        header.title = "Project";
        this.project = new Project();
        this.isEditMode = false;
    }

    ngOnInit() {

        this.route.params
            .switchMap((params: Params) => {
                if (params["id"]) {
                    return this.http.get("/api/projects/" + params["id"]).map((res: Response) => res.json());
                }
                else {
                    return Observable.of(null);
                }
            })
            .subscribe(data => {
                if (data) {
                    this.project = data;
                    this.isEditMode = true;
                }
            },
              err => console.error(err)
            );

    }

    addTag(name: HTMLInputElement) {

        if (!this.project.tags) {
            this.project.tags = [];
        }

        this.project.tags.push(name.value);
        name.value = null;
    }

    deleteTag(index: number) {
        this.project.tags.splice(index, 1);
    }

    addVisibleBranch(branch: HTMLInputElement) {

        if (!this.project.visibleBranches) {
            this.project.visibleBranches = [];
        }

        this.project.visibleBranches.push(branch.value);
        branch.value = null;
    }

    deleteVisibleBranch(index: number) {
        this.project.visibleBranches.splice(index, 1);
    }

    addPeople(contactName: HTMLInputElement, contactEmail: HTMLInputElement) {

        if (!this.project.contactPeople) {
            this.project.contactPeople = [];
        }

        var people = new ContactPerson();
        people.name = contactName.value;
        people.email = contactEmail.value;

        this.project.contactPeople.push(people);
        contactName.value = null;
        contactEmail.value = null;
    }

    deletePeople(index: number) {
        this.project.contactPeople.splice(index, 1);
    }

    addLink(linkName: HTMLInputElement, linkValue: HTMLInputElement) {

        if (!this.project.editLinks) {
            this.project.editLinks = [];
        }

        var link = new EditLink();
        link.branchName = linkName.value;
        link.link = linkValue.value;

        this.project.editLinks.push(link);
        linkName.value = null;
        linkValue.value = null;
    }

    deleteLink(index: number) {
        this.project.editLinks.splice(index, 1);
    }

    onSave() {
        if (this.isEditMode) {
            this.http.put("/api/projects/" + this.project.id, this.project).subscribe(result => {
                if (result.status == 200) {
                    this.toaster.pop('success', 'Success', 'Project was saved successfully.');
                    this.router.navigate(['/projects']);
                } else {
                    this.toaster.pop('error', 'Error', 'There was an error during saving project.');
                }
            });
        }
        else {
            this.http.post("/api/projects", this.project).subscribe(result => {
                if (result.status == 201) {
                    this.toaster.pop('success', 'Success', 'Project was created successfully.');
                    this.router.navigate(['/projects']);
                } else {
                    this.toaster.pop('error', 'Error', 'There was an error during creating project.');
                }
            });
        }
    }
}
