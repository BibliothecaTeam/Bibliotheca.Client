import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { Toc } from '../../model/toc';
import { Branch } from '../../model/branch';
import { HttpClient } from '../../services/httpClient.service';

@Component({
    selector: 'search',
    templateUrl: './app/components/documentation/documentation.component.html'
})
export class DocumentationComponent { 

    public document: Document;
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
                this.fileName = params['file'].replace(/\//g, "%2F");
                this.docsDir = params['docs'];

                if(this.projectId != params['project'] || this.branchName != params['branch'])
                {
                    this.projectId = params['project'];
                    this.branchName = params['branch'];

                    return Observable.forkJoin(
                        this.http.get('http://localhost:5000/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documentation/' + this.docsDir + '%2F' + this.getEncodedFileName()).map((res:Response) => res.json()),
                        this.http.get('http://localhost:5000/api/projects/' + params['project'] + '/branches/' + params['branch']  + '/toc').map((res:Response) => res.json()),
                        this.http.get('http://localhost:5000/api/projects/' + params['project'] + '/branches').map((res:Response) => res.json())
                    );
                }
                else
                {
                    return this.http.get('http://localhost:5000/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documentation/' + this.docsDir + '%2F' + this.getEncodedFileName()).map((res:Response) => res.json());
                }
            })
            .subscribe(data => {

                if(Array.isArray(data))
                {
                    this.prepareDocument(data[0]);
                    this.toc = data[1];
                    this.branches = data[2];    
                }
                else
                {
                    this.prepareDocument(data);
                }
            },
                err => console.error(err)
            );
    }

    getEncodedFileName()
    {
        return this.fileName.replace(/\//g, "%2F");
    }

    getEncodedUrl(url:String)
    {
        return url.replace(/\//g, "%5C");
    }

    prepareDocument(document: Document)
    {
        var regex = /(src=")(.*?)(")/igm;
        var match = regex.exec(document.pageContent);
        while (match) {

            if(!match[2].startsWith("http"))
            {
                document.pageContent = document.pageContent.replace(match[0], "src=\"http://localhost:5000/api/projects/" + this.projectId + "/branches/" + this.branchName + "/documentation/binary/" + this.getEncodedUrl(this.fileName) + "/" + this.getEncodedUrl(match[2]) + "\"");
            }
            var match = regex.exec(document.pageContent);
        }

        this.document = document;
    }
}

interface Document {
    pageContent: string;
}