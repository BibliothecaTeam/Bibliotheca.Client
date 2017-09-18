import * as projectsActions from '../actions/projects';
import { Project } from '../../app/entities/project';

export default function reducer(state = [], action: any): Project[] {
  switch (action.type) {
    case projectsActions.UPDATE_PROJECT:
        return state;
    case projectsActions.DELETE_PROJECT:
        return state;
    case projectsActions.ADD_PROJECT:
        return state;
    case projectsActions.SUCCESS_GET_PROJECTS:
        return action.payload;
    default: {
      return state;
    }
  }
}
