import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { Toc } from '../../model/toc';
import { Branch } from '../../model/branch';
import { Project } from '../../model/project';
import { HttpClientService } from '../../services/httpClient.service';
import {IMultiSelectOption, IMultiSelectSettings,IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import { HeaderService } from '../../services/header.service';

@Component({
    selector: 'search',
    templateUrl: './app/components/documentation/documentation.component.html'
})
export class DocumentationComponent {

    public document: string;
    public toc: Toc[];
    public branches: Branch[];
    public project: Project;

    public projectId: string;
    public branchName: string;
    public fileName: string;
    public docsDir: string;

    private mySettings: IMultiSelectSettings = {
        pullRight: true,
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: false,
        showUncheckAll: false,
        dynamicTitleMaxItems: 3,
        maxHeight: '500px',
    };

    private myTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Change branch',
    };

    constructor(private route: ActivatedRoute, private http: HttpClientService, private header: HeaderService) {
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

                        this.http.get('http://localhost:5000/api/projects/' + this.projectId).map((res: Response) => res.json()),

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
                    this.project = data[2];
                    this.branches = data[3];

                    this.header.title = this.project.name;
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

                var filePath = this.fileName.replace(/\+/g, "/");
                filePath = filePath.substring(0, filePath.lastIndexOf('/'));
                var fullPath = this.getFullPath(filePath, match[2]);

                document = document.replace(match[0], "src=\"http://localhost:5000/api/projects/" + this.projectId + "/branches/" + this.branchName + "/documents/" + fullPath + "/content?access_token=" + localStorage["adal.idtoken"] + "\"");
            }
            var match = regex.exec(document);
        }

        this.document = document;
    }

    getFullPath(prefixPath: string, suffixPath: string): string {

        var path = this.docsDir + "/" + prefixPath + "/" + suffixPath;
        path = path.replace(/\\\\/g, "/");
        path = path.replace(/\\/g, "/");
        path = path.replace(/\/\//g, "/");

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