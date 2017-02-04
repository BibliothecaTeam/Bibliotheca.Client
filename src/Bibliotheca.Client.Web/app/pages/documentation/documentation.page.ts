import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { Toc } from '../../model/toc';
import { Branch } from '../../model/branch';
import { Project } from '../../model/project';
import { EditLink } from '../../model/editLink';
import { HttpClientService } from '../../services/httpClient.service';
import { IMultiSelectOption, IMultiSelectSettings,IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { HeaderService } from '../../services/header.service';

@Component({
    selector: 'documentation',
    templateUrl: './app/pages/documentation/documentation.page.html'
})
export class DocumentationPage {

    public document: string;
    public toc: Toc[];
    public branches: Branch[];
    public project: Project;

    public projectId: string;
    public branchName: string;
    public fileUri: string;

    public editLink: string;
    public previousArticle: Toc;
    public nextArticle: Toc;
    public flatToc: Toc[];

    public breadcrumbs: Toc[];

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

    constructor(private route: ActivatedRoute, private http: HttpClientService, private header: HeaderService, private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams
            .switchMap((params: Params) => {
                this.fileUri = params['file'].replace(/\//g, ":");
                window.scrollTo(0,0);

                if (this.projectId != params['project'] || this.branchName != params['branch']) {
                    this.projectId = params['project'];
                    this.branchName = params['branch'];

                    return Observable.forkJoin(

                        this.http.get('/api/projects/' + this.projectId + '/branches/' + this.branchName + '/toc').map((res: Response) => res.json()),

                        this.http.get('/api/projects/' + this.projectId).map((res: Response) => res.json()),

                        this.http.get('/api/projects/' + this.projectId + '/branches').map((res: Response) => res.json()),

                        this.http.get('/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documents/' + this.fileUri + '/content').map((res: Response) => res.text() as any)
                    );
                }
                else {
                    return this.http.get('/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documents/' + this.fileUri + '/content').map((res: Response) => res.text() as any);
                }
            })
            .subscribe(data => {
                if (Array.isArray(data)) {
                    this.toc = data[0];
                    this.project = data[1];
                    this.branches = data[2];

                    this.header.title = this.project.name;

                    this.flatToc = [];
                    this.changeTocToDictionary(this.toc, null);

                    this.prepareDocument(data[3]);
                    this.prepareEditLink();
                    this.prepareShortcutsToArticles();
                    this.prepareBreadcrumb();
                }
                else {
                    this.prepareDocument(data);
                    this.prepareEditLink();
                    this.prepareShortcutsToArticles();
                    this.prepareBreadcrumb();
                }
            },
                err => console.error(err)
            );
    }

    prepareBreadcrumb() {
        this.breadcrumbs = [];

        var currentToc: Toc = null;
        for(let toc of this.flatToc) {
            if(toc.url == this.fileUri) {
                currentToc = toc;
                break;
            }
        }

        var breadcrumbs: Toc[] = [];
        if(currentToc) {
            while(currentToc) {
                breadcrumbs.push(currentToc);

                if(currentToc.parentIndex) {
                    currentToc = this.flatToc[currentToc.parentIndex];
                }
                else {
                    currentToc = null;
                }
            }
        }

        this.breadcrumbs = breadcrumbs.reverse();
    }

    changeTocToDictionary(tocs: Toc[], parentIndex: number) {
        for(let item of tocs) {
            
            var newToc = new Toc();
            newToc.name = item.name;
            if(item.url) {
                newToc.url = item.url.replace(/\//g, ":");
            }
            newToc.parentIndex = parentIndex;

            this.flatToc.push(newToc);            

            if(item.children && item.children.length > 0) {
                var index = this.flatToc.length - 1;
                this.changeTocToDictionary(item.children, index);
            }

        }
    }

    goToPreviousArticle() {
        window.scrollTo(0,0);
        this.router.navigate(['/documentation'], { queryParams: { project: this.projectId, branch: this.branchName, file: this.previousArticle.url } });
    }

    goToNextArticle() {
        window.scrollTo(0,0);
        this.router.navigate(['/documentation'], { queryParams: { project: this.projectId, branch: this.branchName, file: this.nextArticle.url } });
    }

    prepareShortcutsToArticles() {

        var currentTocIndex = 0;
        for(var i = 0; i < this.flatToc.length; i++) {
            let toc = this.flatToc[i];

            if(toc.url == this.fileUri) {
                currentTocIndex = i;
                break;
            }

        }

        this.previousArticle = null;
        var index = currentTocIndex - 1;
        while(index >= 0) {

            if(this.flatToc[index].url) {
                this.previousArticle = this.flatToc[index];
                break;
            }

            index--;
        }

        this.nextArticle = null;
        index = currentTocIndex + 1;
        while(index < this.flatToc.length) {

            if(this.flatToc[index].url) {
                this.nextArticle = this.flatToc[index];
                break;
            }

            index++;
        }
    }

    prepareEditLink() {
        this.editLink = null;

        for(let link of this.project.editLinks) {
            if(link.branchName == this.branchName) {
                var file = this.fileUri.replace(/\:/g, "%2F");
                this.editLink = link.link.replace("{FILE}", file);
                break;
            }
        }
    }

    navigateToBranch(value: string) {
        if (value) {
            
            var docsDir = '';
            for(let branch of this.branches) {
                if(branch.name === value) {
                    docsDir = branch.docsDir + "/";
                    break;
                }
            }

            window.scrollTo(0,0);
            this.router.navigate(['/documentation'], { queryParams: { project: this.projectId, branch: value, file: docsDir + 'index.md' } });
        }

        return false;
    }

    getEncodedUrl(url: String) {
        return url.replace(/\//g, ":");
    }

    prepareDocument(document: string) {
        var regex = /(src=")(.*?)(")/igm;
        var match = regex.exec(document);
        while (match) {

            if (!match[2].startsWith("http")) {

                var folderPath = this.getFolderPath(this.fileUri);
                var fullPath = this.getFullPath(folderPath, match[2]);

                document = document.replace(match[0], "src=\"" + this.http.serverAddress + "/api/projects/" + this.projectId + "/branches/" + this.branchName + "/documents/" + fullPath + "/content?access_token=" + localStorage["adal.idtoken"] + "\"");
            }
            var match = regex.exec(document);
        }

        this.document = document;
    }

    getFolderPath(uri: string) {
        return uri.substring(0, uri.lastIndexOf(':'));
    }

    getFullPath(prefixPath: string, suffixPath: string): string {

        var path = prefixPath + "/" + suffixPath;
        path = path.replace(/\\\\/g, "/");
        path = path.replace(/\\/g, "/");
        path = path.replace(/\/\//g, "/");
        path = path.replace(/\:/g, "/");
        path = path.replace(/\/.\//g, "/");

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
        path = pathParsed.join(":");
        return path;
    }
}