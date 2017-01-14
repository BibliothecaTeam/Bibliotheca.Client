import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { HttpClientService } from '../../services/httpClient.service';
import { SearchResults } from '../../model/searchResults';

@Component({
    selector: 'search',
    templateUrl: './app/components/search/search.component.html'
})

export class SearchComponent { 

    private searchResults: SearchResults;

    constructor(private header:HeaderService, private route: ActivatedRoute, private http: HttpClientService) {
        header.title = "Searching";
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => {
                return this.http.get("http://localhost:5000/api/search?query=" + params['keywords']).map((res: Response) => res.json())
            })
            .subscribe((searchResults: SearchResults) => { 
                this.searchResults = searchResults; 
            });
    }
}
