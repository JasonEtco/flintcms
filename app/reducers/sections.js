import {
  REQUEST_SECTIONS,
  RECEIVE_SECTIONS,
  NEW_SECTION,
  DELETE_SECTION,
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
      const sectionIndex = state.sections.findIndex(section => section._id === action.newSection._id);
      if (sectionIndex !== -1) return state;

      return {
        ...state,
        sections: [
          ...state.sections,
          action.newSection,
        ],
      };
    }

    case DELETE_SECTION: {
      const sectionIndex = state.sections.findIndex(section => section._id === action._id);
      if (sectionIndex === -1) return state;

      return {
        ...state,
        sections: [
          ...state.entries.slice(0, sectionIndex),
          ...state.entries.slice(sectionIndex + 1),
        ],
      };
    }

    default:
      return state;
  }
}
