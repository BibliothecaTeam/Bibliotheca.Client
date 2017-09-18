import { Injectable } from "@angular/core";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import * as tagsActions from '../actions/tags';
import { of } from "rxjs/observable/of";
import { Store } from "@ngrx/store";
import { AppStore } from "../reducers";
import { Observable } from "rxjs/Rx";
import { empty } from "rxjs/observable/empty";
import { Group } from "../../app/entities/group";
import { GatewayClientService } from "../../app/services/gateway-client.service";
import { Tag } from "../../app/entities/tag";

@Injectable()
export class TagsEffects {

    @Effect()
    getTags$ = this.actions$
        .ofType(tagsActions.INIT_GET_TAGS)
        .map(toPayload)
        .switchMap(() => this.gatewayClient.getTags()
            .map(result => result.json())
            .map(tags => {

                var tagsArray: Tag[] = [];
                tags.forEach(element => {
                    tagsArray.push(new Tag(element, element));
                });

                return new tagsActions.SuccessGetTagsAction(tagsArray);
            })
            .catch((error: any) => of(new tagsActions.FailsGetTagsAction(error))
        )
    );

  constructor(private actions$: Actions, private gatewayClient: GatewayClientService) {}
}