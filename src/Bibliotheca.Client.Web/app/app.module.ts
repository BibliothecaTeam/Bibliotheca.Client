import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MultiselectDropdownModule } from '../node_modules/angular-2-dropdown-multiselect/src/multiselect-dropdown.js';
import { JwtHelper } from 'angular2-jwt';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js'; 
import { ToasterModule, ToasterService } from 'angular2-toaster';

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
import { SearchFieldComponent } from './components/searchField/searchField.component';
import { SearchResultsComponent } from './components/searchResults/searchResults.component';
import { HtmlCompileAttribute } from './components/htmlCompile/htmlCompileAttribute.component';

import { HttpClientService } from './services/httpClient.service'; 
import { HeaderService } from './services/header.service';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationGuard } from './services/authorizationGuard.service';
import { AppConfig } from './services/appConfig.service';
import { CustomErrorHandler } from './services/customErrorHandler.service';
import { HtmlCompileService } from './services/htmlCompile.service';

@NgModule({
  bootstrap:    [ AppPage ],
  declarations: [ 
    AppPage, HomePage, LoginPage, SearchPage, DocumentationPage, 
    TreeViewComponent, BranchesComponent, ProjectsComponent, HeaderComponent, 
    FooterComponent, NoResultsComponent, SearchFieldComponent, SearchResultsComponent, HtmlCompileAttribute ],
  imports:      [ 
    BrowserModule, 
    HttpModule, 
    FormsModule,
    JsonpModule,
    HighlightJsModule,
    MultiselectDropdownModule,
    ToasterModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
    { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthorizationGuard] },
        { path: 'home', component: HomePage, canActivate: [AuthorizationGuard] },
        { path: 'search', component: SearchPage, canActivate: [AuthorizationGuard] },
        { path: 'documentation', component: DocumentationPage, canActivate: [AuthorizationGuard] },
        { path: 'login', component: LoginPage },
        { path: '**', redirectTo: 'home', canActivate: [AuthorizationGuard] }
    ]) 
  ],
  providers: [
    HighlightJsService, HeaderService, AuthorizationService, JwtHelper, AuthorizationGuard, AppConfig, HtmlCompileService,
    {
      provide: HttpClientService,
      useFactory: (backend: XHRBackend, options: RequestOptions, authorization: AuthorizationService, appConfig: AppConfig) => {
        return new HttpClientService(backend, options, authorization, appConfig);
      },
      deps: [XHRBackend, RequestOptions, AuthorizationService, AppConfig]
    },
    { 
      provide: APP_INITIALIZER, 
      useFactory: (config: AppConfig) => () => config.load(), 
      deps: [AppConfig], multi: true 
    }
    //, {provide: ErrorHandler, useClass: CustomErrorHandler}
  ]
})

export class AppModule { }
