import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { HttpClientService } from '../../services/httpClient.service';
import { SearchResults } from '../../model/searchResults';
import { Project } from '../../model/project';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'search',
    templateUrl: './app/components/search/search.component.html'
})

export class SearchComponent { 

    private searchResults: SearchResults;
    private projects: Project[];

    constructor(private header:HeaderService, private route: ActivatedRoute, private http: HttpClientService) {
        header.title = "Searching";
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => {
                return Observable.forkJoin(
                    this.http.get("/api/search?query=" + params['keywords']).map((res: Response) => res.json()),
                    this.http.get('/api/projects').map((res: Response) => res.json())
                );
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
