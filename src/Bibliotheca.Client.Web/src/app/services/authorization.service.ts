import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { AppConfigService } from './app-config.service'

@Injectable()
export class AuthorizationService {

    private tenant: string = null;
    private clientId: string = null;
    private redirectUri: string = null;
    private plRegex = /\+/g;

    constructor(private jwtHeper: JwtHelper, private appConfig: AppConfigService) {
        this.tenant = appConfig.oauthTenant;
        this.clientId = appConfig.oauthClientid;
        this.redirectUri = appConfig.webUrl;
    }

    public processRedirect() {
        let deserializedHash = this.deserializeQueryString(window.location.hash);

        if (this.isAadRedirect(deserializedHash)) {
            localStorage.setItem("adal.idtoken", deserializedHash['id_token']);
        }
    }

    public userIsSignedIn() {
        var isUserSignedIn = false;
        var token = localStorage["adal.idtoken"];
        if (token) {
            var isTokenExpired = this.jwtHeper.isTokenExpired(token);
            isUserSignedIn = !isTokenExpired;
        }

        return isUserSignedIn;
    }

    public initImplicitFlow() {
        try
        {
            this.saveReturnUrl();
            var url = this.createLoginUrl();
            window.location.replace(url);
        }
        catch(error) {
            console.error("Error in initImplicitFlow");
            console.error(error);
        };
    }

    private createLoginUrl() : string {
        var nonce = this.createNonce();
        this.saveNonce(nonce);

        var url = "https://login.microsoftonline.com/" + this.tenant + "/oauth2/authorize"
            + "?response_type=id_token"
            + "&client_id="
            + encodeURIComponent(this.clientId)
            + "&state="
            + encodeURIComponent(nonce)
            + "&redirect_uri="
            + encodeURIComponent(this.redirectUri + '/login')
            + "&nonce="
            + encodeURIComponent(nonce);

        return url;
    };

    private saveReturnUrl() {
        localStorage.setItem("returnUrl", document.location.toString());
    }

    private saveNonce(nonce: string) {
        localStorage.setItem("adal.nonce.idtoken", nonce);
    };

    private createNonce() : string {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 40; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    };

    private deserializeQueryString(queryString: string): any {
        queryString = this.trimHashSign(queryString);

        let match: RegExpExecArray;
        // Regex for replacing addition symbol with a space
        let searchRegex = /([^&=]+)=([^&]*)/g;

        let obj: any = {};
        match = searchRegex.exec(queryString);
        while (match) {
            obj[this.decode(match[1])] = this.decode(match[2]);
            match = searchRegex.exec(queryString);
        }

        return obj;
    }

    private decode(s: string): string {
        return decodeURIComponent(s.replace(this.plRegex, ' '));
    }

    private trimHashSign(hash: string) {
        if (hash.indexOf('#/') > -1) {
            hash = hash.substring(hash.indexOf('#/') + 2);
        } else if (hash.indexOf('#') > -1) {
            hash = hash.substring(1);
        }

        return hash;
    }

    private isAadRedirect(object: any) {
        return (
            object.hasOwnProperty("error_description") ||
            object.hasOwnProperty("access_token") ||
            object.hasOwnProperty("id_token")
        );
    }
}