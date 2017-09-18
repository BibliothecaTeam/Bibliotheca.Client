import * as tagsActions from '../actions/tags';
import { Tag } from '../../app/entities/tag';

export default function reducer(state = [], action: any): Tag[] {
  switch (action.type) {
    case tagsActions.SUCCESS_GET_TAGS:
        return action.payload;
    default: {
      return state;
    }
  }
}
