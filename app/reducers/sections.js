import {
  REQUEST_SECTIONS,
  RECEIVE_SECTIONS,
} from '../actions/sectionActions';

export default function sections(state = {}, action) {
  switch (action.type) {

    case REQUEST_SECTIONS: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_SECTIONS: {
      return {
        ...state,
        sections: action.sections,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    default:
      return state;
  }
}
