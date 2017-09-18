import { Injectable } from "@angular/core";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import * as groupsActions from '../actions/groups';
import { of } from "rxjs/observable/of";
import { Store } from "@ngrx/store";
import { AppStore } from "../reducers";
import { Observable } from "rxjs/Rx";
import { empty } from "rxjs/observable/empty";
import { Group } from "../../app/entities/group";
import { GatewayClientService } from "../../app/services/gateway-client.service";

@Injectable()
export class GroupsEffects {

    @Effect()
    getGroups$ = this.actions$
        .ofType(groupsActions.INIT_GET_GROUPS)
        .map(toPayload)
        .switchMap(() => this.gatewayClient.getGroups()
            .map(result => {

                var groups: Group[] = result.json();

                var allGroups = new Group();
                allGroups.name = "All projects";
                allGroups.svgIcon = "PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjIgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxLjQxNDIxOyI+PHBhdGggZD0iTTEyLjkxMywwLjM0OWMwLjc5OCwwIDEuNTIzLDAuMzEzIDIuMDYsMC44MjJjLTAuMzAzLC0wLjEwMyAtMC42MjksLTAuMTYgLTAuOTY3LC0wLjE2bC02LjAxMiwwYy0xLjY1MywwLjAwMSAtMi45OTQsMS4zNDIgLTIuOTk0LDIuOTk1bDAsNS45ODhjMCwwLjg1NSAwLjM1OSwxLjYyNyAwLjkzNCwyLjE3M2MtMS4xNzksLTAuNDAzIC0yLjAyNywtMS41MjEgLTIuMDI3LC0yLjgzNWwwLC01Ljk4OGMwLC0xLjY1MyAxLjM0MSwtMi45OTUgMi45OTQsLTIuOTk1bDYuMDEyLDBaIiBzdHlsZT0iZmlsbDojZWJlYmViOyIvPjxwYXRoIGQ9Ik0xNy43MjksNC40OTRjMCwtMS42NTMgLTEuMzQxLC0yLjk5NCAtMi45OTQsLTIuOTk0bC02LjAxMiwwYy0xLjY1MywwIC0yLjk5NCwxLjM0MSAtMi45OTQsMi45OTRsMCw1Ljk4OGMwLDEuNjUzIDEuMzQxLDIuOTk1IDIuOTk0LDIuOTk1bDYuMDEyLDBjMS42NTMsMCAyLjk5NCwtMS4zNDIgMi45OTQsLTIuOTk1bDAsLTUuOTg4WiIgc3R5bGU9ImZpbGw6I2ViZWJlYjsiLz48L3N2Zz4=";

                groups.unshift(allGroups);

                return new groupsActions.SuccessGetGroupsAction(groups);
            })
            .catch((error: any) => of(new groupsActions.FailsGetGroupsAction(error))
        )
    );          

  constructor(private actions$: Actions, private gatewayClient: GatewayClientService) {}
}