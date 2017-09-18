import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Action, Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { AppStore } from "../reducers";
import { Observable } from "rxjs/Rx";
import * as projectsActions from '../actions/projects';
import { of } from "rxjs/observable/of";

@Injectable()
export class ProjectsResolver implements Resolve<Action> {

    constructor(private actions$: Actions, private store: Store<AppStore>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Action> {
        this.store.dispatch(new projectsActions.InitGetProjectsAction());
        return this.actions$.ofType(projectsActions.SUCCESS_GET_PROJECTS, projectsActions.FAILS_GET_PROJECTS).take(1);
    }
}