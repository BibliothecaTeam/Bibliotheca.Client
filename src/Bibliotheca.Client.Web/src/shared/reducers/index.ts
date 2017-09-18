import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { Group } from '../../app/entities/group';
import groups from './groups';
import projects from './projects';
import tags from './tags';
import { Project } from '../../app/entities/project';
import { Tag } from '../../app/entities/tag';

export interface AppStore {
  groups: Group[];
  projects: Project[];
  tags: Tag[];
}

export const reducers: ActionReducerMap<AppStore> = {
    groups: groups,
    projects: projects,
    tags: tags
};