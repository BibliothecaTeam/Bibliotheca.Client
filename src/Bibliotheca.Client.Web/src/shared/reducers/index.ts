import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { Group } from '../../app/entities/group';
import groups from './groups';
import projects from './projects';
import tags from './tags';
import filters from './filters';
import { Project } from '../../app/entities/project';
import { Tag } from '../../app/entities/tag';
import { Filter } from '../../app/entities/filter';

export interface AppStore {
  groups: Group[];
  projects: Project[];
  tags: Tag[];
  filters: Filter;
}

export const reducers: ActionReducerMap<AppStore> = {
    groups: groups,
    projects: projects,
    tags: tags,
    filters: filters
};