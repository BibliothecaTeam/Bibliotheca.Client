import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppConfig } from '../../services/appConfig.service'

@Component({
    selector: 'footer-component',
    templateUrl: 'app/components/footer/footer.component.html'
})
export class FooterComponent {

    private siteUrl: string = null;
    private siteName: string = null;

    constructor(private appConfig: AppConfig) {
        this.siteUrl = appConfig.footerUrl;
        this.siteName = appConfig.footerName;
    }
}