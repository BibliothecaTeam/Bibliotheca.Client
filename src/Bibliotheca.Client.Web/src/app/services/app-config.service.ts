import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

declare var setSiteTitle: any;
declare var setCustomStyleUrl: any;
declare var setCustomStyleClass: any;

@Injectable()
export class AppConfigService {
    get apiUrl(): string {
        return environment.api_url;
    }

    get siteTitle(): string {
        return environment.site_title;
    }

    get siteCustomStyleUrl(): string {
        return environment.site_custom_style_url;
    }

    get siteCustomStyleName(): string {
        return environment.site_custom_style_name;
    }

    get footerName(): string {
        return environment.footer_name;
    }

    get footerUrl(): string {
        return environment.footer_url;
    }

    get oauthTenant(): string {
        return environment.oauth_tenant;
    }

    get oauthClientid(): string {
        return environment.oauth_clientid;
    }

    get webUrl(): string {
        return environment.web_url;
    }

    get version(): string {
        return environment.version;
    }

    get build(): string {
        return environment.build;
    }

    public load() {
        setSiteTitle(this.siteTitle);
        setCustomStyleUrl(this.siteCustomStyleUrl);
        setCustomStyleClass(this.siteCustomStyleName);
    }
}