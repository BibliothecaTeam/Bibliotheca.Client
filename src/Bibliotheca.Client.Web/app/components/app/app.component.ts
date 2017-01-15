import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Authentication } from 'adal-ts';

@Component({
    selector: 'app',
    templateUrl: './app/components/app/app.component.html'
})
export class AppComponent 
{
    private searchKeywords: string;
    private isUserSignedIn: boolean = false;

    constructor(private header:HeaderService, private router: Router, private authorization: AuthorizationService)
    {
        this.searchKeywords = "";

        // If user is not signed in we have to redirect to OAuth provider.
        if(authorization.checkIfUserIsSignedIn())
        {
            this.isUserSignedIn = true;
        }
    }

    ngOnInit() 
    {
        // Process the redirect after login.
        Authentication.getAadRedirectProcessor().process();
    }

    public onSearch(event: Event) {
        event.preventDefault();
        this.router.navigate(['/search', this.searchKeywords]);
    }
}