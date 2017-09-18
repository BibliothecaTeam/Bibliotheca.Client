import { Action } from '@ngrx/store';
import { Tag } from '../../app/entities/tag';

// All constants will be exported
export const INIT_GET_TAGS = 'INIT GET TAGS';
export const SUCCESS_GET_TAGS = 'SUCCESS GET TAGS';
export const FAILS_GET_TAGS = 'FAILS GET TAGS';

export class InitGetTagsAction implements Action {
    readonly type = INIT_GET_TAGS;
    
    constructor() { }
}

export class SuccessGetTagsAction implements Action {
    readonly type = SUCCESS_GET_TAGS;
    
    constructor(public payload: Tag[]) { }
}

export class FailsGetTagsAction implements Action {
    readonly type = FAILS_GET_TAGS;
    
    constructor(public error: any) { }
}

// Actions type can be exported to be used by reducer
export type Actions = InitGetTagsAction | SuccessGetTagsAction | FailsGetTagsAction;