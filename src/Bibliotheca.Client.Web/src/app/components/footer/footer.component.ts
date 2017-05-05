import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppConfigService } from '../../services/app-config.service'

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent {

    protected siteUrl: string = null;
    protected siteName: string = null;

    constructor(private appConfig: AppConfigService) {
        this.siteUrl = appConfig.footerUrl;
        this.siteName = appConfig.footerName;
    }
}