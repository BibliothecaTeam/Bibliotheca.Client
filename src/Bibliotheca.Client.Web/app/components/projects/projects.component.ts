import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../model/project';
import { Branch } from '../../model/branch';

@Component({
    selector: 'projects',
    templateUrl: 'app/components/projects/projects.component.html'
})
export class ProjectsComponent {
    
    @Input()
    public projects: Project[];

    @Input()
    public style: string;

    constructor() {
    }
}