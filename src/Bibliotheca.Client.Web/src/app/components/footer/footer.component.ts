import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppConfigService } from '../../services/app-config.service'

@Component({
    selector: 'footer-component',
    templateUrl: './footer.component.html'
})
export class FooterComponent {

    private siteUrl: string = null;
    private siteName: string = null;

    constructor(private appConfig: AppConfigService) {
        this.siteUrl = appConfig.footerUrl;
        this.siteName = appConfig.footerName;
    }
}