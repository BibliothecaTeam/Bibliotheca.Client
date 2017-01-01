import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent }  from './components/app/app.component';
import { HomeComponent }  from './components/home/home.component';
import { SearchComponent }  from './components/search/search.component';
import { NavbarComponent }  from './components/navbar/navbar.component';
import { TreeViewComponent }  from './components/treeview/treeview.component';
import { DocumentationComponent }  from './components/documentation/documentation.component';

import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js'; 
import { HttpClient } from './services/httpClient.service'; 

@NgModule({
  bootstrap:    [ AppComponent ],
  declarations: [ AppComponent, HomeComponent, SearchComponent, NavbarComponent, DocumentationComponent, TreeViewComponent ],
  imports:      [ 
    BrowserModule, 
    HttpModule, 
    JsonpModule,
    HighlightJsModule,
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
    HighlightJsService, HttpClient
  ]
})

export class AppModule { }
