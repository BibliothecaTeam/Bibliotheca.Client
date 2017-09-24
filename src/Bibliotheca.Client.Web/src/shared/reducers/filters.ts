import * as filtersActions from '../actions/filters';
import { Filter } from '../../app/entities/filter';

export default function reducer(state = new Filter(), action: any): Filter {
  switch (action.type) {
    case filtersActions.CHANGE_SELECTED_TAGS:
        var newState = { ...state };
        newState.selectedTags = action.payload;
        return newState;
    case filtersActions.CHANGE_SELECTED_GROUP:
        var newState = { ...state };

        if(action.payload !== "All projects") {
            newState.selectedGroup = action.payload;
        }
        else {
            newState.selectedGroup = "";
        }

        return newState;
    case filtersActions.CLEAR_FILTERS:
        return new Filter();
    default: {
      return state;
    }
  }
}
