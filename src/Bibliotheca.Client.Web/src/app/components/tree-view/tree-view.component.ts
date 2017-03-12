import { Component, Input } from '@angular/core';
import { Toc } from '../../entities/toc';

@Component({
    selector: '[tree-view]',
    template: `
            <li *ngFor="let item of items">
                <a *ngIf="item.url"  [routerLink]="['/documentation', projectId, branchName, item.url]" routerLinkActive="active"> {{ item.name }}</a>
                <a *ngIf="!item.url" href="#"> {{ item.name }}
                    <span class="pull-right-container">
                    <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu" tree-view [projectId]="projectId" [branchName]="branchName" [items]="item.children"></ul>
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
}

