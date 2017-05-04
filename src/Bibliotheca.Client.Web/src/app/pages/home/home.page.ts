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
    private groups: string[];
    private projects: Project[];
    private allProjects: Number;

    private tagsArray: string[];
    private tags: IMultiSelectOption[] = [];

    private selectedTags: string[] = [];
    private selectedGroup: string = "";

    private mySettings: IMultiSelectSettings = {
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

    private myTexts: IMultiSelectTexts = {
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

    openHomeEvent(event: any) {
        this.selectedTags = [];
        this.selectedGroup = "";
        this.filterProject();
    }

    filterProject() {
        this.gatewayClient.getFilteredProjects(this.selectedGroup, this.selectedTags).subscribe(result => {
            var json = result.json();
            this.projects = json.results;
            this.allProjects = json.allResults;
        });
    }

    showGroup(group: string) {
        if(group != "All projects") {
            this.selectedGroup = group;
        }
        else {
            this.selectedGroup = "";
        }

        this.filterProject();
    }

    onTagsChange(event:string[]) {
        this.selectedTags = event;
        this.filterProject();
    }

    getGroupStyle(group: string) {
        if(this.selectedGroup == group) {
            return "active";
        }

        if(this.selectedGroup == "" && group == "All projects") {
            return "active";
        }

        return "";
    }

    getGroupLetters(group: string) : string {
        var matches = group.match(/\b(\w)/g);
        var acronym = matches.join('');
        return acronym.substring(0, 2).toUpperCase();  
    }
}