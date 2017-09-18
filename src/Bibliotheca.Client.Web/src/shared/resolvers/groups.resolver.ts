import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Action, Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { AppStore } from "../reducers";
import { Observable } from "rxjs/Rx";
import * as groupsActions from '../actions/groups';
import { of } from "rxjs/observable/of";

@Injectable()
export class GroupsResolver implements Resolve<Action> {

    public static wasInitialized: boolean = false;

    constructor(private actions$: Actions, private store: Store<AppStore>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Action> {

        if(GroupsResolver.wasInitialized) {
            return of(null);
        }

        GroupsResolver.wasInitialized = true;
        this.store.dispatch(new groupsActions.InitGetGroupsAction());
        return this.actions$.ofType(groupsActions.SUCCESS_GET_GROUPS, groupsActions.FAILS_GET_GROUPS).take(1);
    }
}