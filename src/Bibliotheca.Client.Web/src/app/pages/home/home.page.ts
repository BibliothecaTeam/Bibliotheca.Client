import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../entities/project';
import { Branch } from '../../entities/branch';
import { GatewayClientService } from '../../services/gateway-client.service';
import { HeaderService } from '../../services/header.service';
import { IMultiSelectOption, IMultiSelectSettings,IMultiSelectTexts  } from 'angular-2-dropdown-multiselect';
import { Group } from '../../entities/group';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html'
})
export class HomePage { 
    protected groups: Group[];
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

    constructor(private gatewayClient: GatewayClientService, private header: HeaderService, private sanitizer: DomSanitizer) {

        header.title = "Projects";

        this.gatewayClient.getGroups().subscribe(result => {
            var groups: Group[] = result.json();

            var allGroups = new Group();
            allGroups.name = "All projects";
            allGroups.svgIcon = "PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjIgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxLjQxNDIxOyI+PHBhdGggZD0iTTEyLjkxMywwLjM0OWMwLjc5OCwwIDEuNTIzLDAuMzEzIDIuMDYsMC44MjJjLTAuMzAzLC0wLjEwMyAtMC42MjksLTAuMTYgLTAuOTY3LC0wLjE2bC02LjAxMiwwYy0xLjY1MywwLjAwMSAtMi45OTQsMS4zNDIgLTIuOTk0LDIuOTk1bDAsNS45ODhjMCwwLjg1NSAwLjM1OSwxLjYyNyAwLjkzNCwyLjE3M2MtMS4xNzksLTAuNDAzIC0yLjAyNywtMS41MjEgLTIuMDI3LC0yLjgzNWwwLC01Ljk4OGMwLC0xLjY1MyAxLjM0MSwtMi45OTUgMi45OTQsLTIuOTk1bDYuMDEyLDBaIiBzdHlsZT0iZmlsbDojZWJlYmViOyIvPjxwYXRoIGQ9Ik0xNy43MjksNC40OTRjMCwtMS42NTMgLTEuMzQxLC0yLjk5NCAtMi45OTQsLTIuOTk0bC02LjAxMiwwYy0xLjY1MywwIC0yLjk5NCwxLjM0MSAtMi45OTQsMi45OTRsMCw1Ljk4OGMwLDEuNjUzIDEuMzQxLDIuOTk1IDIuOTk0LDIuOTk1bDYuMDEyLDBjMS42NTMsMCAyLjk5NCwtMS4zNDIgMi45OTQsLTIuOTk1bDAsLTUuOTg4WiIgc3R5bGU9ImZpbGw6I2ViZWJlYjsiLz48L3N2Zz4=";

            groups.unshift(allGroups);
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