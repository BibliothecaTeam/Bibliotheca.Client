import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SearchResults } from '../../model/searchResults';

@Component({
    selector: 'search-results-component',
    templateUrl: 'app/components/searchResults/searchResults.component.html'
})
export class SearchResultsComponent {

    @Input()
    public results: SearchResults;

}