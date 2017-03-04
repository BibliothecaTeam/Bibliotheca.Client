import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SearchResults } from '../../entities/search-results';

@Component({
    selector: 'search-results-component',
    templateUrl: './search-results.component.html'
})
export class SearchResultsComponent {

    @Input()
    public results: SearchResults;

}