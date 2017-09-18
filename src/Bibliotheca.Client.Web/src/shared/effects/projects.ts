import { Injectable } from "@angular/core";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import * as projectsActions from '../actions/projects';
import { of } from "rxjs/observable/of";
import { Store } from "@ngrx/store";
import { AppStore } from "../reducers";
import { Observable } from "rxjs/Rx";
import { empty } from "rxjs/observable/empty";
import { Group } from "../../app/entities/group";
import { GatewayClientService } from "../../app/services/gateway-client.service";
import { Project } from "../../app/entities/project";

@Injectable()
export class ProjectsEffects {
    
    @Effect()
    getProjects$ = this.actions$
        .ofType(projectsActions.INIT_GET_PROJECTS)
        .map(action => action as projectsActions.InitGetProjectsAction)
        .switchMap(action => this.gatewayClient.getFilteredProjects(action.group, action.tags)
            .map(result => result.json().results as Project[])
            .map(projects => new projectsActions.SuccessGetProjectsAction(projects))
            .catch((error: any) => of(new projectsActions.FailsGetProjectsAction(error)) 
        )
    ); 

    constructor(private actions$: Actions, private gatewayClient: GatewayClientService) {}
}