import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthorizationService } from './authorization.service';
import { AppConfigService } from './app-config.service';

@Injectable()
export class HttpClientService extends Http {

    public serverAddress: string = null;

    constructor(backend: XHRBackend, defaultOptions: RequestOptions, private authorization: AuthorizationService, private appConfig: AppConfigService) {
        super(backend, defaultOptions);

        this.serverAddress = appConfig.apiUrl;
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

        var resourceUrl:string;

        if (typeof url === 'string') {
            if (!options) {
                options = { headers: new Headers() };
            }
            this.setHeaders(options);
            url = this.serverAddress + url;
        } else {
            this.setHeaders(url);
            url.url = this.serverAddress + url.url;
        }

        return super.request(url, options).catch(this.catchErrors());
    }

    private catchErrors() {
        return (res: Response) => {
            if (res.status === 401) {
                this.authorization.initImplicitFlow();
            }
            return Observable.throw(res);
        };
    }

    createAuthorizationHeader(headers: Headers) {
        var token = localStorage.getItem("adal.idtoken");
        if(token != null)
        {
            headers.append('Authorization', 'Bearer ' + token);
        }
    }

    private setHeaders(objectToSetHeadersTo: Request | RequestOptionsArgs) {
        this.createAuthorizationHeader(objectToSetHeadersTo.headers);
    }
}