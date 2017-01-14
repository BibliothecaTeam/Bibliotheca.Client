import { Component, Input } from '@angular/core';
import { Toc } from '../../model/toc';
import { EncodeFilterPipe } from '../../pipes/encode.pipe';

@Component({
    selector: '[tree-view]',
    template: `
            <li *ngFor="let item of items">
                <a *ngIf="item.url"  [routerLink]="'/documentation'" [queryParams]="{ project: '' + projectId + '', branch: '' + branchName + '', docs: '' + docsDir + '', file: '' + item.url }" routerLinkActive="active"> {{ item.name }}</a>
                <a *ngIf="!item.url" href="#"> {{ item.name }}
                    <span class="pull-right-container">
                    <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu" tree-view [items]="item.children" [projectId]="projectId" [branchName]="branchName" [docsDir]="docsDir"></ul>
            </li>
            `
})
export class TreeViewComponent {
    
    @Input() 
    public items: Array<Toc>;

    @Input()
    public projectId: string;
    
    @Input()
    public branchName: string;

    @Input()
    public docsDir: string;
}

