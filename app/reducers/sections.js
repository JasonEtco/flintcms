import {
  REQUEST_SECTIONS,
  RECEIVE_SECTIONS,
  NEW_SECTION,
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

    case NEW_SECTION: {
      return {
        ...state,
        sections: [
          ...state.sections,
          action.newSection,
        ],
      };
    }

    default:
      return state;
  }
}
