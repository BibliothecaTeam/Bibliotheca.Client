import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare var setSiteTitle: any;
declare var setCustomStyleUrl: any;
declare var setCustomStyleClass: any;

@Injectable()
export class AppConfig {
    private config: Object = null;

    constructor(private http: Http) {
    }

    public getConfig(key: any) {
        return this.config[key];
    }

    get apiUrl(): string {
        return this.config["api_url"];
    }

    get siteTitle(): string {
        return this.config["site_title"];
    }

    get siteCustomStyleUrl(): string {
        return this.config["site_custom_style_url"];
    }

    get siteCustomStyleName(): string {
        return this.config["site_custom_style_name"];
    }

    get footerName(): string {
        return this.config["footer_name"];
    }

    get footerUrl(): string {
        return this.config["footer_url"];
    }

    get oauthTenant(): string {
        return this.config["oauth_tenant"];
    }

    get oauthClientid(): string {
        return this.config["oauth_clientid"];
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('configuration.json').map( res => res.json() ).catch((error: any):any => {
                console.log('Configuration file "configuration.json" could not be read');
                resolve(true);
                return Observable.throw(error.json().error || 'Server error');
            }).subscribe( (configResponse: any) => {
                this.config = configResponse;

                setSiteTitle(this.siteTitle);
                setCustomStyleUrl(this.siteCustomStyleUrl);
                setCustomStyleClass(this.siteCustomStyleName);

                resolve(true);
            });

        });
    }
}