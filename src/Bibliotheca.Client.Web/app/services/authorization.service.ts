import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthorizationService {

    private tenant: string = "";
    private clientId: string = "";

    constructor(private jwtHeper: JwtHelper) {
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

        this.createLoginUrl().then(function (url) {
            window.location.replace(url);
        })
        .catch(function (error) {
            console.error("Error in initImplicitFlow");
            console.error(error);
        });
    };

    private createLoginUrl() {
        var that = this;

        return this.createAndSaveNonce().then(function (nonce: any) {

            var url = "https://login.microsoftonline.com/" + that.tenant + "/oauth2/authorize"
                + "?response_type=id_token"
                + "&client_id="
                + encodeURIComponent(that.clientId)
                + "&state="
                + encodeURIComponent(nonce)
                + "&redirect_uri="
                + encodeURIComponent(window.location.origin + '/login')
                + "&nonce="
                + encodeURIComponent(nonce);

            return url;
        });
    };

    createAndSaveNonce() {
        var that = this;
        return this.createNonce().then(function (nonce: any) {
            localStorage.setItem("adal.nonce.idtoken", nonce);
            return nonce;
        })

    };

    createNonce() {

        return new Promise((resolve, reject) => {

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 40; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            resolve(text);
        });
    };

    private static plRegex = /\+/g;

    private static deserializeQueryString(queryString: string): any {

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

    private static decode(s: string): string {
        return decodeURIComponent(s.replace(this.plRegex, ' '));
    }

    private static trimHashSign(hash: string) {
        if (hash.indexOf('#/') > -1) {
            hash = hash.substring(hash.indexOf('#/') + 2);
        } else if (hash.indexOf('#') > -1) {
            hash = hash.substring(1);
        }

        return hash;
    }

    private static isAadRedirect(object: any) {
        return (
            object.hasOwnProperty("error_description") ||
            object.hasOwnProperty("access_token") ||
            object.hasOwnProperty("id_token")
        );
    }

    public static processRedirect() {

        let deserializedHash = this.deserializeQueryString(window.location.hash);

        if (this.isAadRedirect(deserializedHash)) {
            localStorage.setItem("adal.idtoken", deserializedHash['id_token']);
        }
    }
}