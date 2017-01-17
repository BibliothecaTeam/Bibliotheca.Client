import { NgModule }      from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { JwtHelper } from 'angular2-jwt';

import { AppComponent }  from './components/app/app.component';
import { HomeComponent }  from './components/home/home.component';
import { SearchComponent }  from './components/search/search.component';
import { TreeViewComponent }  from './components/treeview/treeview.component';
import { DocumentationComponent }  from './components/documentation/documentation.component';
import { BranchesComponent }  from './components/branches/branches.component';
import { ProjectsComponent }  from './components/projects/projects.component';

import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js'; 
import { HttpClientService } from './services/httpClient.service'; 
import { HeaderService } from './services/header.service';
import { AuthorizationService } from './services/authorization.service';

@NgModule({
  bootstrap:    [ AppComponent ],
  declarations: [ AppComponent, HomeComponent, SearchComponent, DocumentationComponent, TreeViewComponent, BranchesComponent, ProjectsComponent ],
  imports:      [ 
    BrowserModule, 
    HttpModule, 
    FormsModule,
    JsonpModule,
    HighlightJsModule,
    MultiselectDropdownModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'search/:keywords', component: SearchComponent },
        { path: 'documentation', component: DocumentationComponent },
        { path: '**', redirectTo: 'home' }
    ]) 
  ],
  providers: [
    HighlightJsService, HeaderService, AuthorizationService, JwtHelper,
    {
      provide: HttpClientService,
      useFactory: (backend: XHRBackend, options: RequestOptions, authorization: AuthorizationService) => {
        return new HttpClientService(backend, options, authorization);
      },
      deps: [XHRBackend, RequestOptions, AuthorizationService]
    }
  ]
})

export class AppModule { }
