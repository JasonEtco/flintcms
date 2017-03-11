import update from 'immutability-helper';
import {
  REQUEST_SECTIONS,
  RECEIVE_SECTIONS,
  NEW_SECTION,
  DELETE_SECTION,
  UPDATE_SECTION,
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
      const sectionIndex = state.sections
        .findIndex(section => section._id === action.addSection._id);

      if (sectionIndex !== -1) return state;

      return {
        ...state,
        sections: [
          ...state.sections,
          action.addSection,
        ],
      };
    }

    case DELETE_SECTION: {
      const sectionIndex = state.sections.findIndex(section => section._id === action._id);
      if (sectionIndex === -1) return state;

      return {
        ...state,
        sections: [
          ...state.sections.slice(0, sectionIndex),
          ...state.sections.slice(sectionIndex + 1),
        ],
      };
    }

    case UPDATE_SECTION: {
      const { _id } = action.updateSection;
      const sectionIndex = state.sections.findIndex(section => section._id === _id);
      if (sectionIndex === -1) return state;

      return {
        ...state,
        sections: [
          ...state.sections.slice(0, sectionIndex),
          update(state.sections[sectionIndex], { $merge: { ...action.updateSection, full: true } }),
          ...state.sections.slice(sectionIndex + 1),
        ],
      };
    }

    default:
      return state;
  }
}
