import update from 'immutability-helper';
import {
  REQUEST_FIELDS,
  RECEIVE_FIELDS,
  NEW_FIELD,
  UPDATE_FIELD,
  DELETE_FIELD,
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
      return {
        ...state,
        fields: [
          ...state.fields,
          action.addField,
        ],
      };
    }

    case DELETE_FIELD: {
      const fieldIndex = state.fields.findIndex(field => field._id === action.id);
      if (fieldIndex === -1) return state;

      return {
        ...state,
        fields: [
          ...state.fields.slice(0, fieldIndex),
          ...state.fields.slice(fieldIndex + 1),
        ],
      };
    }

    case UPDATE_FIELD: {
      const { _id } = action.updatedField;
      const fieldIndex = state.fields.findIndex(field => field._id === _id);
      if (fieldIndex === -1) return state;

      return {
        ...state,
        fields: [
          ...state.fields.slice(0, fieldIndex),
          update(state.fields[fieldIndex], { $merge: action.updatedField }),
          ...state.fields.slice(fieldIndex + 1),
        ],
      };
    }

    default:
      return state;
  }
}
