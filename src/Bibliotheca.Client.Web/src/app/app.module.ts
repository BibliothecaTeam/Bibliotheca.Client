import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule, Router } from '@angular/router';

import { JwtHelper } from 'angular2-jwt';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MultiselectDropdownModule  } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';

import { AppComponent } from './app.component';

import { AppConfigService } from './services/app-config.service'
import { AuthorizationService } from './services/authorization.service'
import { AuthorizationGuardService } from './services/authorization-guard.service'
import { HeaderService } from './services/header.service'
import { HtmlCompileService } from './services/html-compile.service'
import { HttpClientService } from './services/http-client.service';

import { BranchesComponent } from './components/branches/branches.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HtmlCompileAttributeComponent } from './components/html-compile-attribute/html-compile-attribute.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';

import { DocumentationPage } from './pages/documentation/documentation.page';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { SearchPage } from './pages/search/search.page';
import { Error400Page } from './pages/error400/error400.page'
import { Error404Page } from './pages/error404/error404.page'
import { Error500Page } from './pages/error500/error500.page'

export function httpClientServiceFactory(backend: XHRBackend, options: RequestOptions, authorization: AuthorizationService, appConfig: AppConfigService, router: Router) {
  return new HttpClientService(backend, options, authorization, appConfig, router);
}

export function appInitializationFactory(config: AppConfigService) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    BranchesComponent,
    FooterComponent,
    HeaderComponent,
    HtmlCompileAttributeComponent,
    NoResultsComponent,
    ProjectsComponent,
    SearchFieldComponent,
    SearchResultsComponent,
    TreeViewComponent,
    DocumentationPage,
    HomePage,
    LoginPage,
    SearchPage,
    Error400Page,
    Error404Page,
    Error500Page
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ToasterModule,
    HighlightJsModule,
    MultiselectDropdownModule,
    RouterModule.forRoot([
    { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthorizationGuardService] },
        { path: 'home', component: HomePage, canActivate: [AuthorizationGuardService] },
        { path: 'search/:query', component: SearchPage, canActivate: [AuthorizationGuardService] },
        { path: 'documentation/:project/:branch/:file', component: DocumentationPage, canActivate: [AuthorizationGuardService] },
        { path: 'documentation/:project/:branch/:file/:query', component: DocumentationPage, canActivate: [AuthorizationGuardService] },
        { path: 'login', component: LoginPage },
        { path: 'error400', component: Error400Page },
        { path: 'error404', component: Error404Page },
        { path: 'error500', component: Error500Page },
        { path: '**', redirectTo: 'home', canActivate: [AuthorizationGuardService] }
    ]) 
  ],
  providers: [
    AppConfigService,
    AuthorizationService,
    AuthorizationGuardService,
    HeaderService,
    HtmlCompileService,
    HttpClientService,
    HighlightJsService,
    JwtHelper,
    {
      provide: HttpClientService,
      useFactory: httpClientServiceFactory,
      deps: [XHRBackend, RequestOptions, AuthorizationService, AppConfigService, Router]
    },
    { 
      provide: APP_INITIALIZER, 
      useFactory: appInitializationFactory, 
      deps: [AppConfigService], multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
