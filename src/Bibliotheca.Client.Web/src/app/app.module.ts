import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule, Router } from '@angular/router';

import { JwtHelper } from 'angular2-jwt';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MultiselectDropdownModule  } from 'angular-2-dropdown-multiselect';
import { UiSwitchModule } from 'angular2-ui-switch/src'

import { AppComponent } from './app.component';

import { AppConfigService } from './services/app-config.service';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationGuardService } from './services/authorization-guard.service';
import { HeaderService } from './services/header.service';
import { HtmlCompileService } from './services/html-compile.service';
import { HttpClientService } from './services/http-client.service';
import { PermissionService } from './services/permission.service';
import { GatewayClientService } from './services/gateway-client.service';

import { BranchesComponent } from './components/branches/branches.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HtmlCompileAttributeComponent } from './components/html-compile-attribute/html-compile-attribute.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { ProjectsBlocksComponent } from './components/projects-blocks/projects-blocks.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import { ServiceHealthComponent } from './components/service-health/service-health.component';

import { DocumentationPage } from './pages/documentation/documentation.page';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { SearchPage } from './pages/search/search.page';
import { Error400Page } from './pages/error400/error400.page'
import { Error403Page } from './pages/error403/error403.page'
import { Error404Page } from './pages/error404/error404.page'
import { Error500Page } from './pages/error500/error500.page';
import { ForbiddenPage } from './pages/forbidden/forbidden.page';
import { UsersPage } from './pages/users/users.page';
import { UserInfoPage } from './pages/user-info/user-info.page';
import { ProjectsPage } from './pages/projects/projects.page';
import { ProjectInfoPage } from './pages/project-info/project-info.page';
import { AccountPage } from './pages/account/account.page';
import { ServicesPage } from './pages/services/services.page';
import { BranchesPage } from './pages/branches/branches.page';
import { GroupsPage } from './pages/groups/groups.page';
import { GroupInfoPage } from './pages/group-info/group-info.page';
import { LogsPage } from './pages/logs/logs.page';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from '../shared/reducers';

import { GroupsEffects } from '../shared/effects/groups';
import { ProjectsEffects } from '../shared/effects/projects';
import { TagsEffects } from '../shared/effects/tags';
import { FiltersEffects } from '../shared/effects/filters';

import { GroupsResolver } from '../shared/resolvers/groups.resolver';
import { ProjectsResolver } from '../shared/resolvers/projects.resolver';
import { TagsResolver } from '../shared/resolvers/tags.resolver';


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
    ProjectsBlocksComponent,
    SearchFieldComponent,
    SearchResultsComponent,
    TreeViewComponent,
    SettingsMenuComponent,
    ServiceHealthComponent,
    DocumentationPage,
    HomePage,
    LoginPage,
    SearchPage,
    Error400Page,
    Error403Page,
    Error404Page,
    Error500Page,
    UsersPage,
    UserInfoPage,
    ProjectsPage,
    ProjectInfoPage,
    AccountPage,
    ForbiddenPage,
    ServicesPage,
    BranchesPage,
    GroupsPage,
    GroupInfoPage,
    LogsPage
  ],
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([GroupsEffects, ProjectsEffects, TagsEffects, FiltersEffects]),
    BrowserModule,
    FormsModule,
    HttpModule,
    ToasterModule,
    HighlightJsModule,
    MultiselectDropdownModule,
    UiSwitchModule,
    RouterModule.forRoot([
    { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthorizationGuardService] },
        { path: 'home', component: HomePage, resolve: { 
            groupsAction: GroupsResolver, 
            projectsAction: ProjectsResolver,
            tagsAction: TagsResolver
          }, 
          canActivate: [AuthorizationGuardService] 
        },
        { path: 'search/:query', component: SearchPage, canActivate: [AuthorizationGuardService] },
        { path: 'docs/:project', component: DocumentationPage, canActivate: [AuthorizationGuardService] },
        { path: 'docs/:project/:branch', component: DocumentationPage, canActivate: [AuthorizationGuardService] },
        { path: 'docs/:project/:branch/:file', component: DocumentationPage, canActivate: [AuthorizationGuardService] },
        { path: 'docs/:project/:branch/:file/:query', component: DocumentationPage, canActivate: [AuthorizationGuardService] },
        { path: 'users', component: UsersPage, canActivate: [AuthorizationGuardService] },
        { path: 'services', component: ServicesPage, canActivate: [AuthorizationGuardService] },
        { path: 'groups', component: GroupsPage, canActivate: [AuthorizationGuardService] },
        { path: 'group-info', component: GroupInfoPage, canActivate: [AuthorizationGuardService] },
        { path: 'group-info/:id', component: GroupInfoPage, canActivate: [AuthorizationGuardService] },
        { path: 'user-info', component: UserInfoPage, canActivate: [AuthorizationGuardService] },
        { path: 'user-info/:id', component: UserInfoPage, canActivate: [AuthorizationGuardService] },
        { path: 'projects', component: ProjectsPage, canActivate: [AuthorizationGuardService] },
        { path: 'project-info', component: ProjectInfoPage, canActivate: [AuthorizationGuardService] },
        { path: 'project-info/:id', component: ProjectInfoPage, canActivate: [AuthorizationGuardService] },
        { path: 'projects/:id/branches', component: BranchesPage, canActivate: [AuthorizationGuardService] },
        { path: 'projects/:id/logs', component: LogsPage, canActivate: [AuthorizationGuardService] },
        { path: 'account', component: AccountPage, canActivate: [AuthorizationGuardService] },
        { path: 'login', component: LoginPage },
        { path: 'error400', component: Error400Page },
        { path: 'error403', component: Error403Page },
        { path: 'error404', component: Error404Page },
        { path: 'error500', component: Error500Page },
        { path: 'forbidden', component: ForbiddenPage },
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
    PermissionService,
    GatewayClientService,
    GroupsResolver,
    ProjectsResolver,
    TagsResolver,
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
