import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Project } from '../../model/project';
import { Branch } from '../../model/branch';
import { HttpClient } from '../../services/httpClient.service';

@Component({
    selector: 'home',
    templateUrl: './app/components/home/home.component.html',
    styleUrls: ['./app/components/home/home.component.css']
})

export class HomeComponent { 
    public groups: string[];
    public projects: Project[];
    public allProjects: Number;
    public tags: string[];
    public branches: Branch[];

    constructor(http: HttpClient) {

        http.get('http://localhost:5000/api/groups').subscribe(result => {
            var groups: string[] = result.json();
            groups.unshift("All projects");
            this.groups = groups;
        });

        http.get('http://localhost:5000/api/projects').subscribe(result => {
            var json = result.json();
            this.projects = json.results;
            this.allProjects = json.allResults;
        });

        http.get('http://localhost:5000/api/tags').subscribe(result => {
            this.tags = result.json();
        });

        http.get('http://localhost:5000/api/branches').subscribe(result => {
            this.branches = result.json();
        });
    }
}