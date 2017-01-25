import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../model/project';
import { Branch } from '../../model/branch';
import { HttpClientService } from '../../services/httpClient.service';
import { HeaderService } from '../../services/header.service';
import {IMultiSelectOption, IMultiSelectSettings,IMultiSelectTexts} from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'home',
    templateUrl: './app/components/home/home.component.html',
    styleUrls: ['./app/components/home/home.component.css']
})
export class HomeComponent { 
    public groups: string[];
    public projects: Project[];
    public allProjects: Number;

    public tagsArray: string[];
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

    constructor(private httpClient: HttpClientService, private header: HeaderService) {

        header.title = "Projects";

        httpClient.get('/api/groups').subscribe(result => {
            var groups: string[] = result.json();
            groups.unshift("All projects");
            this.groups = groups;
        });

        httpClient.get('/api/projects').subscribe(result => {
            var json = result.json();
            this.projects = json.results;
            this.allProjects = json.allResults;
        });

        httpClient.get('/api/tags').subscribe(result => {
            this.tagsArray = result.json();
            this.tagsArray.forEach(element => {
                this.tags.push({ id: element, name: element });
                //this.selectedTags.push(element);
            });
        });
    }

    filterProject() {

        var groupfilter = "";
        if(this.selectedGroup != "") {
            groupfilter = "?groups=" + this.selectedGroup;
        }

        var tagsFilter = "";
        if(this.selectedTags.length > 0) {
            var separator = "&";
            if(groupfilter == "") {
                separator = "?";
            }

            for(let selectedtag of this.selectedTags) {
                tagsFilter +=  separator + "tags=" + selectedtag;
                separator = "&";
            }
        }

        this.httpClient.get('/api/projects' + groupfilter + tagsFilter).subscribe(result => {
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
}