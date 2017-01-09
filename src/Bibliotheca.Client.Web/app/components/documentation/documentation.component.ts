import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { Toc } from '../../model/toc';
import { Branch } from '../../model/branch';
import { HttpClient } from '../../services/httpClient.service';

@Component({
    selector: 'search',
    templateUrl: './app/components/documentation/documentation.component.html'
})
export class DocumentationComponent {

    public document: string;
    public toc: Toc[];
    public branches: Branch[];

    public projectId: string;
    public branchName: string;
    public fileName: string;
    public docsDir: string;

    constructor(private route: ActivatedRoute, private http: HttpClient) {
    }

    ngOnInit() {
        this.route.queryParams
            .switchMap((params: Params) => {
                this.fileName = params['file'].replace(/\//g, "+");
                this.docsDir = params['docs'];

                if (this.projectId != params['project'] || this.branchName != params['branch']) {
                    this.projectId = params['project'];
                    this.branchName = params['branch'];

                    return Observable.forkJoin(

                        this.http.get('http://localhost:5000/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documents/' + this.docsDir + '+' + this.fileName + '/content').map((res: Response) => res.text() as any),

                        this.http.get('http://localhost:5000/api/projects/' + this.projectId + '/branches/' + this.branchName + '/toc').map((res: Response) => res.json()),

                        this.http.get('http://localhost:5000/api/projects/' + this.projectId + '/branches').map((res: Response) => res.json())
                    );
                }
                else {
                    return this.http.get('http://localhost:5000/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documents/' + this.docsDir + '+' + this.fileName + '/content').map((res: Response) => res.text() as any);
                }
            })
            .subscribe(data => {
                if (Array.isArray(data)) {
                    this.prepareDocument(data[0]);
                    this.toc = data[1];
                    this.branches = data[2];
                }
                else {
                    this.prepareDocument(data);
                }
            },
            err => console.error(err)
            );
    }

    getEncodedUrl(url: String) {
        return url.replace(/\//g, "+");
    }

    prepareDocument(document: string) {
        var regex = /(src=")(.*?)(")/igm;
        var match = regex.exec(document);
        while (match) {

            if (!match[2].startsWith("http")) {

                var fullPath = this.getFullPath(this.fileName, match[2]);

                document = document.replace(match[0], "src=\"http://localhost:5000/api/projects/" + this.projectId + "/branches/" + this.branchName + "/documents/" + fullPath + "/content?access_token=" + localStorage["adal.idtoken"] + "\"");
            }
            var match = regex.exec(document);
        }

        this.document = document;
    }

    getFullPath(prefixPath: string, suffixPath: string): string {
        var path = this.docsDir + "/" + prefixPath + "/" + suffixPath;
        path = path.replace("\\\\", "/");
        path = path.replace("\\", "/");
        var pathParts = path.split('/');

        var dotsNumber = 0;
        var pathParsed = new Array();
        for (var i = pathParts.length - 1; i >= 0; --i) {
            if (pathParts[i] == "..") {
                dotsNumber++;
            }
            else {
                if (dotsNumber == 0) {
                    pathParsed.push(pathParts[i]);
                }
                else {
                    dotsNumber--;
                }
            }
        }

        pathParsed.reverse();
        path = pathParsed.join("+");
        return path;
    }
}