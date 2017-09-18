import { Action } from '@ngrx/store';
import { Group } from '../../app/entities/group';

// All constants will be exported
export const INIT_GET_GROUPS = 'INIT GET GROUPS';
export const SUCCESS_GET_GROUPS = 'SUCCESS GET GROUPS';
export const FAILS_GET_GROUPS = 'FAILS GET GROUPS';
export const ADD_GROUP = 'ADD GROUP';
export const DELETE_GROUP = 'DELETE GROUP';
export const UPDATE_GROUP = 'UPDATE GROUP';

export class InitGetGroupsAction implements Action {
    readonly type = INIT_GET_GROUPS;
    
    constructor() { }
}

export class SuccessGetGroupsAction implements Action {
    readonly type = SUCCESS_GET_GROUPS;
    
    constructor(public payload: Group[]) { }
}

export class FailsGetGroupsAction implements Action {
    readonly type = FAILS_GET_GROUPS;
    
    constructor(public error: any) { }
}

export class AddGroupAction implements Action {
  readonly type = ADD_GROUP;

  constructor(public name: string) { }
}

export class DeleteGroupAction implements Action {
    readonly type = DELETE_GROUP;

    constructor(public id: string) { }
}

export class UpdateGroupAction implements Action {
    readonly type = UPDATE_GROUP;
    
    constructor(public id: string, public name: string) { }
}

// Actions type can be exported to be used by reducer
export type Actions = AddGroupAction | DeleteGroupAction | UpdateGroupAction | InitGetGroupsAction | SuccessGetGroupsAction | FailsGetGroupsAction;