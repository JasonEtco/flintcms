import {
  REQUEST_ENTRIES,
  RECEIVE_ENTRIES,
  NEW_ENTRY,
} from '../actions/entryActions';

export default function entries(state = {}, action) {
  switch (action.type) {

    case REQUEST_ENTRIES: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_ENTRIES: {
      return {
        ...state,
        entries: action.entries,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    case NEW_ENTRY: {
      return {
        ...state,
        entries: [
          ...state.entries,
          action.json,
        ],
      };
    }

    default:
      return state;
  }
}
