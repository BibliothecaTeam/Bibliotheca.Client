import { Action } from '@ngrx/store';
import { Project } from '../../app/entities/project';

// All constants will be exported
export const INIT_GET_PROJECTS = 'INIT GET PROJECTS';
export const SUCCESS_GET_PROJECTS = 'SUCCESS GET PROJECTS';
export const FAILS_GET_PROJECTS = 'FAILS GET PROJECTS';
export const ADD_PROJECT = 'ADD PROJECT';
export const DELETE_PROJECT = 'DELETE PROJECT';
export const UPDATE_PROJECT = 'UPDATE PROJECT';

export class InitGetProjectsAction implements Action {
    readonly type = INIT_GET_PROJECTS;
    
    constructor(public tags: string[] = null, public group: string = null) { }
}

export class SuccessGetProjectsAction implements Action {
    readonly type = SUCCESS_GET_PROJECTS;
    
    constructor(public payload: Project[]) { }
}

export class FailsGetProjectsAction implements Action {
    readonly type = FAILS_GET_PROJECTS;
    
    constructor(public error: any) { }
}

export class AddProjectAction implements Action {
  readonly type = ADD_PROJECT;

  constructor(public name: string) { }
}

export class DeleteProjectAction implements Action {
    readonly type = DELETE_PROJECT;

    constructor(public id: string) { }
}

export class UpdateProjectAction implements Action {
    readonly type = UPDATE_PROJECT;
    
    constructor(public id: string, public name: string) { }
}

// Actions type can be exported to be used by reducer
export type Actions = AddProjectAction | DeleteProjectAction | UpdateProjectAction | InitGetProjectsAction | SuccessGetProjectsAction | FailsGetProjectsAction;