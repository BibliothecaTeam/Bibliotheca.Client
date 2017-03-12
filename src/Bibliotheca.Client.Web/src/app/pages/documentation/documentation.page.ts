import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import { Toc } from '../../entities/toc';
import { Branch } from '../../entities/branch';
import { SearchResults } from '../../entities/search-results';
import { Project } from '../../entities/project';
import { EditLink } from '../../entities/edit-link';
import { HttpClientService } from '../../services/http-client.service';
import { HeaderService } from '../../services/header.service';

@Component({
    selector: 'app-documentation',
    templateUrl: './documentation.page.html'
})
export class DocumentationPage {
    public ref: DocumentationPage;

    private document: string;
    private toc: Toc[];
    private branches: Branch[];
    private project: Project;

    private projectId: string;
    private branchName: string;
    private fileUri: string;

    private editLink: string;
    private previousArticle: Toc;
    private nextArticle: Toc;
    private flatToc: Toc[];

    private breadcrumbs: Toc[];
    private searchResults: SearchResults;

    constructor(private route: ActivatedRoute, private http: HttpClientService, private header: HeaderService, private router: Router) {
        this.ref = this;
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => {

                if(params["query"]) {

                    if (this.projectId != params['project'] || this.branchName != params['branch']) {
                        this.projectId = params['project'];
                        this.branchName = params['branch'];

                        return Observable.forkJoin(

                            this.http.get('/api/projects/' + this.projectId + '/branches/' + this.branchName + '/toc').map((res: Response) => res.json()),

                            this.http.get('/api/projects/' + this.projectId).map((res: Response) => res.json()),

                            this.http.get('/api/projects/' + this.projectId + '/branches').map((res: Response) => res.json()),

                            this.http.get("/api/search/projects/" + params["project"] + "/branches/" + 
                                params["branch"] + "?query=" + params["query"]).map((res: Response) => res.json())
                        );
                    }
                    else {
                        return this.http.get("/api/search/projects/" + params["project"] + "/branches/" + 
                            params["branch"] + "?query=" + params["query"]).map((res: Response) => res.json());
                    }
                }
                else 
                {
                    this.fileUri = params['file'].replace(/\//g, ":");
                    window.scrollTo(0,0);

                    if (this.projectId != params['project'] || this.branchName != params['branch']) {
                        this.projectId = params['project'];
                        this.branchName = params['branch'];

                        return Observable.forkJoin(

                            this.http.get('/api/projects/' + this.projectId + '/branches/' + this.branchName + '/toc').map((res: Response) => res.json()),

                            this.http.get('/api/projects/' + this.projectId).map((res: Response) => res.json()),

                            this.http.get('/api/projects/' + this.projectId + '/branches').map((res: Response) => res.json()),

                            this.http.get('/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documents/content/' + this.fileUri).map((res: Response) => res.text() as any)
                        );
                    }
                    else {
                        return this.http.get('/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documents/content/' + this.fileUri).map((res: Response) => res.text() as any);
                    }
                }
            })
            .subscribe(data => {
                if (Array.isArray(data)) {
                    this.searchResults = null;
                    this.toc = data[0];
                    this.project = data[1];
                    this.branches = data[2];

                    this.header.title = this.project.name;

                    this.flatToc = [];
                    this.changeTocToDictionary(this.toc, null);

                    if(this.isSearchResultPage(data[3])) {
                        this.document = null;
                        this.prepareSearchResultPage(data[3]);
                    }
                    else {
                        this.prepareDocumentPage(data[3]);
                    }
                }
                else {
                    if(this.isSearchResultPage(data)) {
                        this.document = null;
                        this.prepareSearchResultPage(data);
                    }
                    else {
                        this.searchResults = null;
                        this.prepareDocumentPage(data);
                    }
 
                }
            },
                error => {
                    console.error(error);
                }
            );
    }

    isSearchResultPage(response: any) : boolean {
        return response.numberOfResults || response.numberOfResults == 0;
    }

    prepareSearchResultPage(searchResults: SearchResults) {
        this.breadcrumbs = [];
        var toc = new Toc();
        toc.name = "Search results";
        this.breadcrumbs.push(toc);

        this.searchResults = searchResults;
    }

    prepareDocumentPage(document: string) {
        this.prepareDocument(document);
        this.prepareEditLink();
        this.prepareShortcutsToArticles();
        this.prepareBreadcrumb();
    }

    prepareDocument(document: string) {
        var parsedDocument = this.changeImageSource(document);
        parsedDocument = this.changeHrefToInternalPage(parsedDocument);
        parsedDocument = this.escapeCurlyBrackets(parsedDocument);

        this.document = parsedDocument;
    }

    prepareBreadcrumb() {
        this.breadcrumbs = [];
        var fileUriWithoutAnchor = this.fileUri.split("#")[0];

        var currentToc: Toc = null;
        for(let toc of this.flatToc) {
            if(toc.url == fileUriWithoutAnchor) {
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
        this.router.navigate(['/documentation', this.projectId, this.branchName, this.previousArticle.url]);
    }

    goToNextArticle() {
        window.scrollTo(0,0);
        this.router.navigate(['/documentation', this.projectId, this.branchName, this.nextArticle.url]);
    }

    public goToDocument(file: string) {
        window.scrollTo(0,0);
        this.router.navigate(['/documentation', this.projectId, this.branchName, file]);
    }

    prepareShortcutsToArticles() {

        var currentTocIndex = 0;
        var fileUriWithoutAnchor = this.fileUri.split("#")[0];

        for(var i = 0; i < this.flatToc.length; i++) {
            let toc = this.flatToc[i];

            if(toc.url == fileUriWithoutAnchor) {
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
            this.router.navigate(['/documentation', this.projectId, value, docsDir + 'index.md']);
        }

        return false;
    }

    getEncodedUrl(url: String) {
        return url.replace(/\//g, ":");
    }

    escapeCurlyBrackets(document: string) : string {
        var escapedDocument = document.replace(/{/g, "&#123;");
        escapedDocument = escapedDocument.replace(/}/g, "&#125;");
        return escapedDocument;
    }

    changeHrefToInternalPage(document: string) : string {
        var regex = /(href=")(.*?)(")/igm;
        var match = regex.exec(document);
        while (match) {

            if (!match[2].startsWith("http")) {

                var folderPath = this.getFolderPath(this.fileUri);
                var fullPath = this.getFullPath(folderPath, match[2]);

                document = document.replace(match[0], "style=\"cursor: pointer;\" (click)=\"ref.goToDocument('" + fullPath + "')\"");
            }
            var match = regex.exec(document);
        }

        return document;
    }

    changeImageSource(document: string) : string {
        var regex = /(src=")(.*?)(")/igm;
        var match = regex.exec(document);
        while (match) {

            if (!match[2].startsWith("http")) {

                var folderPath = this.getFolderPath(this.fileUri);
                var fullPath = this.getFullPath(folderPath, match[2]);

                document = document.replace(match[0], "src=\"" + this.http.serverAddress + "/api/projects/" + this.projectId + "/branches/" + this.branchName + "/documents/content/" + fullPath + "?access_token=" + localStorage["adal.idtoken"] + "\"");
            }
            var match = regex.exec(document);
        }

        return document;
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