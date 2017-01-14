import { Component } from '@angular/core';
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

    constructor(http: HttpClientService, header: HeaderService) {

        header.title = "Projects";

        http.get('http://localhost:5000/api/groups').subscribe(result => {
            var groups: string[] = result.json();
            groups.unshift("All projects");
            this.groups = groups;
        });

        http.get('http://localhost:5000/api/projects').subscribe(result => {
            var json = result.json();
            this.projects = json.results;
            this.allProjects = json.allResults;
        });

        http.get('http://localhost:5000/api/tags').subscribe(result => {
            this.tagsArray = result.json();
            this.tagsArray.forEach(element => {
                this.tags.push({ id: element, name: element });
            });
        });
    }
}