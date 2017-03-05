import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { HttpClientService } from '../../services/http-client.service';
import { SearchResults } from '../../entities/search-results';
import { Project } from '../../entities/project';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html'
})

export class SearchPage { 

    private searchResults: SearchResults;
    private projects: Project[];

    constructor(private header:HeaderService, private route: ActivatedRoute, private http: HttpClientService) {
        header.title = "Searching";
    }

    ngOnInit() {
        this.route.queryParams
            .switchMap((params: Params) => {

                if(params["project"]) {
                    return Observable.forkJoin(
                        this.http.get("/api/search/projects/" + params["project"] + "/branches/" + 
                            params["branch"] + "?query=" + params["query"]).map((res: Response) => res.json()),
                        this.http.get("/api/projects?query=" + params["query"]).map((res: Response) => res.json())
                    );
                }
                else {
                    return Observable.forkJoin(
                        this.http.get("/api/search?query=" + params["query"]).map((res: Response) => res.json()),
                        this.http.get("/api/projects?query=" + params["query"]).map((res: Response) => res.json())
                    );
                }

            })
            .subscribe(data => {
                    this.searchResults = data[0];
                    var projectResults = data[1].results;

                    this.projects = [];
                    var index = 0;
                    for(let project of projectResults) {
                        index++;
                        this.projects.push(project);

                        if(index >= 3) {
                            break;
                        }
                    }
            },
                err => console.error(err)
            );
    }
}
