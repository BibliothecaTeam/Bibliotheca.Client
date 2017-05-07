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
import { GatewayClientService } from '../../services/gateway-client.service';
import { HeaderService } from '../../services/header.service';
import { AppConfigService } from '../../services/app-config.service';

enum PageContext {
    QueryEmpty = 1,
    QueryWithContext = 2,
    DocumentEmpty = 3,
    DocumentWithContext = 4,
    FileAndBranchNotSpecify = 5,
    FileNotSpecify = 6
}

declare var saveAs: any;

@Component({
    selector: 'app-documentation',
    templateUrl: './documentation.page.html'
})
export class DocumentationPage {
    public ref: DocumentationPage;

    protected document: string;
    protected toc: Toc[];
    protected branches: Branch[];
    protected project: Project;

    protected projectId: string;
    protected branchName: string;
    protected fileUri: string;

    protected editLink: string;
    protected previousArticle: Toc;
    protected nextArticle: Toc;
    protected flatToc: Toc[];

    protected breadcrumbs: Toc[];
    protected searchResults: SearchResults;

    constructor(
        private route: ActivatedRoute, 
        private gatewayClient: GatewayClientService, 
        private header: HeaderService, 
        private router: Router,
        private appConfig: AppConfigService) 
    {
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
                            Observable.of({ requestType: PageContext.QueryEmpty }),

                            this.gatewayClient.getTableOfContents(this.projectId, this.branchName).map((res: Response) => res.json()),
                            this.gatewayClient.getProject(this.projectId).map((res: Response) => res.json()),
                            this.gatewayClient.getBranches(this.projectId).map((res: Response) => res.json()),
                            this.gatewayClient.searchInBranch(params["project"], params["branch"], params["query"])
                                .map((res: Response) => res.json())
                        );
                    }
                    else {

                        return Observable.forkJoin(
                            Observable.of({ requestType: PageContext.QueryWithContext }),

                            this.gatewayClient.searchInBranch(params["project"], params["branch"], params["query"])
                                .map((res: Response) => res.json())
                        );
                    }
                }
                else 
                {
                    if(!params['file'] && !params['branch']) {
                        this.projectId = params['project'];

                        return Observable.forkJoin(
                            Observable.of({ requestType: PageContext.FileAndBranchNotSpecify }),

                            this.gatewayClient.getProject(this.projectId).map((res: Response) => res.json()),
                            this.gatewayClient.getBranches(this.projectId).map((res: Response) => res.json())
                        );
                    }
                    else if(!params['file']) {
                        this.projectId = params['project'];
                        this.branchName = params['branch'];
                        
                        return Observable.forkJoin(
                            Observable.of({ requestType: PageContext.FileNotSpecify }),

                            this.gatewayClient.getBranches(this.projectId).map((res: Response) => res.json())
                        );
                    }
                    else {

                        window.scrollTo(0,0);
                        this.fileUri = params['file'].replace(/\//g, ":");

                        if (this.projectId != params['project'] || this.branchName != params['branch']) {
                            this.projectId = params['project'];
                            this.branchName = params['branch'];

                            return Observable.forkJoin(

                                Observable.of({ requestType: PageContext.DocumentEmpty }),

                                this.gatewayClient.getTableOfContents(this.projectId, this.branchName).map((res: Response) => res.json()),
                                this.gatewayClient.getProject(this.projectId).map((res: Response) => res.json()),
                                this.gatewayClient.getBranches(this.projectId).map((res: Response) => res.json()),
                                this.gatewayClient.getDocumentContent(this.projectId, this.branchName, this.fileUri).map((res: Response) => res.text() as any)
                            );
                        }
                        else {
                            return Observable.forkJoin(
                                
                                Observable.of({ requestType: PageContext.DocumentWithContext }),

                                this.gatewayClient.getDocumentContent(this.projectId, this.branchName, this.fileUri).map((res: Response) => res.text() as any)
                            );
                        }

                    }
                }
            })
            .subscribe(data => {
                this.searchResults = null;
                this.document = null;

                var requestType = data[0].requestType;
                if(requestType == PageContext.QueryEmpty) {
                    
                    this.toc = data[1];
                    this.project = data[2];
                    this.branches = data[3];

                    this.header.title = this.project.name;

                    this.flatToc = [];
                    this.changeTocToDictionary(this.toc, null);
                    this.prepareSearchResultPage(data[4]);
                }
                else if(requestType == PageContext.DocumentEmpty) {
                    this.searchResults = null;
                    this.toc = data[1];
                    this.project = data[2];
                    this.branches = data[3];

                    this.header.title = this.project.name;

                    this.flatToc = [];
                    this.changeTocToDictionary(this.toc, null);
                    this.prepareDocumentPage(data[4]);
                }
                else if(requestType == PageContext.QueryWithContext) {
                    this.prepareSearchResultPage(data[1]);
                }
                else if(requestType == PageContext.DocumentWithContext) {
                    this.prepareDocumentPage(data[1]);
                }
                else if(requestType == PageContext.FileAndBranchNotSpecify) {
                    var project:Project = data[1];
                    var branches:Branch[] = data[2];

                    let fileUri = this.getDefaultFileUri(branches, project.defaultBranch);
                    this.router.navigate(['/docs', project.id, project.defaultBranch, fileUri]);
                }
                else if(requestType == PageContext.FileNotSpecify) {
                    var branches:Branch[] = data[1];

                    let fileUri = this.getDefaultFileUri(branches, this.branchName);
                    this.router.navigate(['/docs', this.projectId, this.branchName, fileUri]);
                }
            },
                error => {
                    console.error(error);
                }
            );
    }

    private getDefaultFileUri(branches: Branch[], branchName:String) : string {
        var fileUri:string;
        for(let branch of branches) {
            if(branch.name == branchName) {
                fileUri = branch.docsDir + ":index.md";
                break;
            }
        }

        return fileUri;
    }

    private prepareSearchResultPage(searchResults: SearchResults) {
        this.breadcrumbs = [];
        var toc = new Toc();
        toc.name = "Search results";
        this.breadcrumbs.push(toc);

        this.searchResults = searchResults;
    }

    private prepareDocumentPage(document: string) {
        this.prepareDocument(document);
        this.prepareEditLink();
        this.prepareShortcutsToArticles();
        this.prepareBreadcrumb();
    }

    private prepareDocument(document: string) {
        var parsedDocument = this.changeImageSource(document);
        parsedDocument = this.changeHrefToInternalPage(parsedDocument);
        parsedDocument = this.escapeCurlyBrackets(parsedDocument);

        this.document = parsedDocument;
    }

    private prepareBreadcrumb() {
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

    private changeTocToDictionary(tocs: Toc[], parentIndex: number) {
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

    private goToPreviousArticle() {
        window.scrollTo(0,0);
        this.router.navigate(['/docs', this.projectId, this.branchName, this.previousArticle.url]);
    }

    private goToNextArticle() {
        window.scrollTo(0,0);
        this.router.navigate(['/docs', this.projectId, this.branchName, this.nextArticle.url]);
    }

    public goToDocument(file: string) {
        if(this.isMarkdownFile(file)) {
            if(this.isSameFileAsOpened(file)) {
                var elementId = this.getPathFragment(file);
                document.getElementById(elementId).scrollIntoView(); 
            }
            else {
                window.scrollTo(0,0);
                this.router.navigate(['/docs', this.projectId, this.branchName, file]);
            }
        }
        else {
            var url = this.appConfig.apiUrl + '/api/projects/' + this.projectId + '/branches/' + this.branchName + '/documents/content/' + file + "?access_token=" + localStorage["adal.idtoken"];
            window.location.assign(url);
        }
    }

    private isMarkdownFile(file: string) : boolean {
        var fileExtension = this.getExtension(file);
        return fileExtension === "md";
    }

    private isSameFileAsOpened(file: string) : boolean {
        var pathWithoutFragment = this.getPathWithoutFragment(file);
        return this.fileUri === pathWithoutFragment;
    }

    private getPathWithoutFragment(url: string) : string {
        var index = url.indexOf("#");
        if (index !== -1) {
            url = url.substring(0, index);
        }

        return url;
    }

    private getPathFragment(url: string) : string {
        var index = url.indexOf("#");
        if (index !== -1) {
            url = url.substring(index + 1, url.length);
        }

        return url;
    }

    private getExtension(url: string) : string {
        if (url === null) {
            return "";
        }
        
        var index = url.lastIndexOf("/");
        if (index !== -1) {
            url = url.substring(index + 1);
        }

        index = url.indexOf("?");
        if (index !== -1) {
            url = url.substring(0, index);
        }

        index = url.indexOf("#");
        if (index !== -1) {
            url = url.substring(0, index);
        }

        index = url.lastIndexOf(".");
        return index !== -1 ? url.substring(index + 1) : "";
    }

    private prepareShortcutsToArticles() {

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

    private prepareEditLink() {
        this.editLink = null;

        for(let link of this.project.editLinks) {
            if(link.branchName == this.branchName) {
                var file = this.fileUri.replace(/\:/g, "%2F");
                this.editLink = link.link.replace("{FILE}", file);
                break;
            }
        }
    }

    private navigateToBranch(value: string) {
        if (value) {
            
            var docsDir = '';
            for(let branch of this.branches) {
                if(branch.name === value) {
                    docsDir = branch.docsDir + "/";
                    break;
                }
            }

            window.scrollTo(0,0);
            this.router.navigate(['/docs', this.projectId, value, docsDir + 'index.md']);
        }

        return false;
    }

    private getEncodedUrl(url: String) {
        return url.replace(/\//g, ":");
    }

    private escapeCurlyBrackets(document: string) : string {
        var escapedDocument = document.replace(/{/g, "&#123;");
        escapedDocument = escapedDocument.replace(/}/g, "&#125;");
        return escapedDocument;
    }

    private changeHrefToInternalPage(document: string) : string {
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

    private changeImageSource(document: string) : string {
        var regex = /(src=")(.*?)(")/igm;
        var match = regex.exec(document);
        while (match) {

            if (!match[2].startsWith("http")) {

                var folderPath = this.getFolderPath(this.fileUri);
                var fullPath = this.getFullPath(folderPath, match[2]);

                var pathToImage = this.gatewayClient.getPathToImage(this.projectId, this.branchName, fullPath);
                document = document.replace(match[0], pathToImage);
            }
            var match = regex.exec(document);
        }

        return document;
    }

    private getFolderPath(uri: string) {
        return uri.substring(0, uri.lastIndexOf(':'));
    }

    private getFullPath(prefixPath: string, suffixPath: string): string {

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

    protected downloadPdf() {
        this.gatewayClient.getPdfFile(this.projectId, this.branchName).subscribe(response => {
            var file = new Blob([response.blob()], {type: 'application/pdf'});
            saveAs(file, this.project.id + '.pdf')
        });
    }
}