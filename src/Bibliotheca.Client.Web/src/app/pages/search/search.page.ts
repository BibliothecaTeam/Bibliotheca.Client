import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { GatewayClientService } from '../../services/gateway-client.service';
import { SearchResults } from '../../entities/search-results';
import { Project } from '../../entities/project';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html'
})

export class SearchPage { 

    protected searchResults: SearchResults;
    protected projects: Project[];

    constructor(private header:HeaderService, private route: ActivatedRoute, private gatewayClient: GatewayClientService) {
        header.title = "Searching";
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => {

                if(params["project"]) {
                    return Observable.forkJoin(
                        this.gatewayClient.searchInBranch(params["project"], params["branch"], params["query"]).map((res: Response) => res.json()),
                        this.gatewayClient.getProjectsWithKeywords(params["query"]).map((res: Response) => res.json())
                    );
                }
                else {
                    return Observable.forkJoin(
                        this.gatewayClient.search(params["query"]).map((res: Response) => res.json()),
                        this.gatewayClient.getProjectsWithKeywords(params["query"]).map((res: Response) => res.json())
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
