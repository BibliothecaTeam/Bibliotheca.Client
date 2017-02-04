import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'search-component',
    templateUrl: 'app/components/search/search.component.html'
})
export class SearchComponent {
    private searchKeywords: string;

    constructor(private router: Router) {
        this.searchKeywords = "";
    }

    public onSearch(event: Event) {
        event.preventDefault();
        this.router.navigate(['/search', this.searchKeywords]);
    }
}