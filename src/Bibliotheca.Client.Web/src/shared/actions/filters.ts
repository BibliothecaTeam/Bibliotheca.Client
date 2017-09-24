import { Action } from '@ngrx/store';

// All constants will be exported
export const CHANGE_SELECTED_TAGS = 'CHANGE SELECTED TAGS';
export const CHANGE_SELECTED_GROUP = 'CHANGE SELECTED GROUP';
export const CLEAR_FILTERS = 'CLEAR FILTERS';


export class ChangeSelectedTagsAction implements Action {
    readonly type = CHANGE_SELECTED_TAGS;
    
    constructor(public payload: string[]) { }
}

export class ChangeSelectedGroupAction implements Action {
    readonly type = CHANGE_SELECTED_GROUP;
    
    constructor(public payload: string) { }
}

export class ClearFiltersAction implements Action {
    readonly type = CLEAR_FILTERS;
    
    constructor() { }
}

// Actions type can be exported to be used by reducer
export type Actions = ChangeSelectedTagsAction | ChangeSelectedGroupAction | ClearFiltersAction;