import {
  REQUEST_FIELDS,
  RECEIVE_FIELDS,
  NEW_FIELD,
} from '../actions/fieldActions';

export default function fields(state = {}, action) {
  switch (action.type) {

    case REQUEST_FIELDS: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_FIELDS: {
      return {
        ...state,
        fields: action.fields,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    case NEW_FIELD: {
      return state;
    }

    default:
      return state;
  }
}
