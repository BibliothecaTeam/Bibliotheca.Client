import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HeaderService } from '../../services/header.service';
import { Router } from '@angular/router';

@Component({
    selector: 'header-component',
    templateUrl: 'app/components/header/header.component.html'
})
export class HeaderComponent {

    private searchKeywords: string;

    constructor(private header: HeaderService, private router: Router) {
        this.searchKeywords = "";
    }

    public onSearch(event: Event) {
        event.preventDefault();
        this.router.navigate(['/search', this.searchKeywords]);
    }

}