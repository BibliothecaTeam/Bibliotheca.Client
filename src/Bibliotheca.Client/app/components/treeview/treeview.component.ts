import { Component, Input } from '@angular/core';
import { Toc } from '../../model/toc';
import { EncodeFilterPipe } from '../../pipes/encode.pipe';

@Component({
    selector: 'tree-view',
    template: `
        <ul *ngIf="items?.length > 0">
            <li *ngFor="let item of items">
                <a *ngIf="item.url" [routerLink]="'/documentation'" [queryParams]="{ project: '' + projectId + '', branch: '' + branchName + '', docs: '' + docsDir + '', file: '' + item.url }" routerLinkActive="active">{{ item.name }}</a>
                <span *ngIf="!item.url">{{ item.name }}</span>
                <tree-view [items]="item.children" [projectId]="projectId" [branchName]="branchName" [docsDir]="docsDir"></tree-view>
            </li>
        </ul>`
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