import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent }  from './components/app/app.component';
import { HomeComponent }  from './components/home/home.component';
import { SearchComponent }  from './components/search/search.component';
import { TreeViewComponent }  from './components/treeview/treeview.component';
import { DocumentationComponent }  from './components/documentation/documentation.component';
import { BranchesComponent }  from './components/branches/branches.component';

import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js'; 
import { HttpClient } from './services/httpClient.service'; 
import { HeaderService } from './services/header.service';

import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';

@NgModule({
  bootstrap:    [ AppComponent ],
  declarations: [ AppComponent, HomeComponent, SearchComponent, DocumentationComponent, TreeViewComponent, BranchesComponent ],
  imports:      [ 
    BrowserModule, 
    HttpModule, 
    JsonpModule,
    HighlightJsModule,
    MultiselectDropdownModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'search', component: SearchComponent },
        { path: 'documentation', component: DocumentationComponent },
        { path: '**', redirectTo: 'home' }
    ]) 
  ],
  providers: [
    HighlightJsService, HttpClient, HeaderService
  ]
})

export class AppModule { }
