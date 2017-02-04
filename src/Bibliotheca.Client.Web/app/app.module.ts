import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { JwtHelper } from 'angular2-jwt';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js'; 

import { AppPage } from './pages/app/app.page';
import { DocumentationPage } from './pages/documentation/documentation.page';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { SearchPage } from './pages/search/search.page';

import { TreeViewComponent } from './components/treeview/treeview.component';
import { BranchesComponent } from './components/branches/branches.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NoResultsComponent } from './components/noresults/noresults.component';
import { SearchComponent } from './components/search/search.component';

import { HttpClientService } from './services/httpClient.service'; 
import { HeaderService } from './services/header.service';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationGuard } from './services/authorizationGuard.service';

@NgModule({
  bootstrap:    [ AppPage ],
  declarations: [ 
    AppPage, HomePage, LoginPage, SearchPage, DocumentationPage, 
    TreeViewComponent, BranchesComponent, ProjectsComponent, HeaderComponent, FooterComponent, NoResultsComponent, SearchComponent ],
  imports:      [ 
    BrowserModule, 
    HttpModule, 
    FormsModule,
    JsonpModule,
    HighlightJsModule,
    MultiselectDropdownModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
    { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthorizationGuard] },
        { path: 'home', component: HomePage, canActivate: [AuthorizationGuard] },
        { path: 'search/:keywords', component: SearchPage, canActivate: [AuthorizationGuard] },
        { path: 'documentation', component: DocumentationPage, canActivate: [AuthorizationGuard] },
        { path: 'login', component: LoginPage },
        { path: '**', redirectTo: 'home', canActivate: [AuthorizationGuard] }
    ]) 
  ],
  providers: [
    HighlightJsService, HeaderService, AuthorizationService, JwtHelper, AuthorizationGuard,
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
