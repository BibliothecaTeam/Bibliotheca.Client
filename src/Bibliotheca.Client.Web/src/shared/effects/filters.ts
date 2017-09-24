import { Injectable } from "@angular/core";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import * as projectsActions from '../actions/projects';
import * as filtersActions from '../actions/filters';
import { of } from "rxjs/observable/of";
import { Store } from "@ngrx/store";
import { AppStore } from "../reducers";
import { Observable } from "rxjs/Rx";
import { empty } from "rxjs/observable/empty";
import { Group } from "../../app/entities/group";
import { GatewayClientService } from "../../app/services/gateway-client.service";
import { Project } from "../../app/entities/project";
import { Filter } from "../../app/entities/filter";

@Injectable()
export class FiltersEffects {
    
    public filters$: Observable<Filter> = this.store.select(x => x.filters);

    @Effect()
    getProjects$ = this.actions$
        .ofType(filtersActions.CHANGE_SELECTED_TAGS, filtersActions.CHANGE_SELECTED_GROUP, filtersActions.CLEAR_FILTERS)
        .withLatestFrom(this.filters$, (action, filters) => filters)
        .map((x) => new projectsActions.InitGetProjectsAction(x.selectedTags, x.selectedGroup)
    );

    constructor(private actions$: Actions, private gatewayClient: GatewayClientService, private store: Store<AppStore>) {}
}