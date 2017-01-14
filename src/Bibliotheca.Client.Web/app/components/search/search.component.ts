import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HeaderService } from '../../services/header.service';

@Component({
    selector: 'search',
    templateUrl: './app/components/search/search.component.html'
})

export class SearchComponent { 
    constructor(private header:HeaderService) {
        header.title = "Searching";
    }
}
