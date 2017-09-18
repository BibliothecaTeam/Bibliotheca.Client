import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Action, Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { AppStore } from "../reducers";
import { Observable } from "rxjs/Rx";
import * as tagsActions from '../actions/tags';
import { of } from "rxjs/observable/of";

@Injectable()
export class TagsResolver implements Resolve<Action> {

    public static wasInitialized: boolean = false;

    constructor(private actions$: Actions, private store: Store<AppStore>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Action> {

        if(TagsResolver.wasInitialized) {
            return of(null);
        }

        TagsResolver.wasInitialized = true;
        this.store.dispatch(new tagsActions.InitGetTagsAction());
        return this.actions$.ofType(tagsActions.SUCCESS_GET_TAGS, tagsActions.FAILS_GET_TAGS).take(1);
    }
}