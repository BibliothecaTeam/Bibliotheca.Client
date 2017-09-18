import * as groupsActions from '../actions/groups';
import { Group } from '../../app/entities/group';

export default function reducer(state = [], action: any): Group[] {
  switch (action.type) {
    case groupsActions.UPDATE_GROUP:
        return state;
    case groupsActions.DELETE_GROUP:
        return state;
    case groupsActions.ADD_GROUP:
        return state;
    case groupsActions.SUCCESS_GET_GROUPS:
        return action.payload;
    default: {
      return state;
    }
  }
}
