import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { GatewayClientService } from '../../services/gateway-client.service';
import { HeaderService } from '../../services/header.service';
import { IMultiSelectOption, IMultiSelectSettings,IMultiSelectTexts  } from 'angular-2-dropdown-multiselect';
import { Group } from '../../entities/group';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../shared/reducers';
import * as projectsActions from '../../../shared/actions/projects';
import { Tag } from '../../entities/tag';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html'
})
export class HomePage { 
    
    protected groups$: Observable<Group[]> = this.store.select(x => x.groups);
    protected projects$: Observable<Project[]> = this.store.select(x => x.projects);
    protected tags$: Observable<Tag[]> = this.store.select(x => x.tags);

    protected selectedTags: string[] = [];
    protected selectedGroup: string = "";

    protected mySettings: IMultiSelectSettings = {
        pullRight: true,
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: true,
        showUncheckAll: true,
        dynamicTitleMaxItems: 3,
        maxHeight: '500px',
    };

    protected myTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Choose tags',
    };

    constructor(
        private gatewayClient: GatewayClientService, 
        private header: HeaderService, 
        private sanitizer: DomSanitizer, 
        private store: Store<AppStore>) 
    {
        header.title = "Projects"; 
    }

    protected openHomeEvent(event: any) {
        this.selectedTags = [];
        this.selectedGroup = "";
        this.filterProject();
    }

    protected filterProject() {
        this.store.dispatch(new projectsActions.InitGetProjectsAction(this.selectedTags, this.selectedGroup));
    }

    protected showGroup(group: string) {
        if(group != "All projects") {
            this.selectedGroup = group;
        }
        else {
            this.selectedGroup = "";
        }

        this.filterProject();
    }

    protected getSvgImage(svgIcon: string) {
        return this.sanitizer.bypassSecurityTrustUrl("data:image/svg+xml;base64," + svgIcon);
    }

    protected onTagsChange(event:string[]) {
        this.selectedTags = event;
        this.filterProject();
    }

    protected getGroupStyle(group: string) {
        if(this.selectedGroup == group) {
            return "active";
        }

        if(this.selectedGroup == "" && group == "All projects") {
            return "active";
        }

        return "";
    }
}