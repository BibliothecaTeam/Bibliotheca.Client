import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { GatewayClientService } from '../../services/gateway-client.service';
import { HeaderService } from '../../services/header.service';
import { IMultiSelectOption, IMultiSelectSettings,IMultiSelectTexts  } from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html'
})
export class HomePage { 
    protected groups: string[];
    protected projects: Project[];
    protected allProjects: Number;

    protected tagsArray: string[];
    protected tags: IMultiSelectOption[] = [];

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

    constructor(private gatewayClient: GatewayClientService, private header: HeaderService) {

        header.title = "Projects";

        this.gatewayClient.getGroups().subscribe(result => {
            var groups: string[] = result.json();
            groups.unshift("All projects");
            this.groups = groups;
        });

        this.gatewayClient.getProjects().subscribe(result => {
            var json = result.json();
            this.projects = json.results;
            this.allProjects = json.allResults;
        });

        this.gatewayClient.getTags().subscribe(result => {
            this.tagsArray = result.json();
            this.tagsArray.forEach(element => {
                this.tags.push({ id: element, name: element });
            });
        });
    }

    protected openHomeEvent(event: any) {
        this.selectedTags = [];
        this.selectedGroup = "";
        this.filterProject();
    }

    protected filterProject() {
        this.gatewayClient.getFilteredProjects(this.selectedGroup, this.selectedTags).subscribe(result => {
            var json = result.json();
            this.projects = json.results;
            this.allProjects = json.allResults;
        });
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

    protected getGroupLetters(group: string) : string {
        var matches = group.match(/\b(\w)/g);
        var acronym = matches.join('');
        return acronym.substring(0, 2).toUpperCase();  
    }
}