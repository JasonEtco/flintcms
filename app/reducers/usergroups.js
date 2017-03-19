import update from 'immutability-helper';
import {
  REQUEST_USERGROUPS,
  RECEIVE_USERGROUPS,
  NEW_USERGROUP,
  DELETE_USERGROUP,
  UPDATE_USERGROUP,
} from '../actions/usergroupActions';

export default function users(state = {}, action) {
  switch (action.type) {

    case REQUEST_USERGROUPS: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_USERGROUPS: {
      return {
        ...state,
        usergroups: action.usergroups,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    case NEW_USERGROUP: {
      return {
        ...state,
        usergroups: [
          ...state.usergroups,
          action.addUserGroup,
        ],
      };
    }

    case DELETE_USERGROUP: {
      const usergroupIndex = state.usergroups.findIndex(usergroup => usergroup._id === action.id);
      if (usergroupIndex === -1) return state;

      return {
        ...state,
        usergroups: [
          ...state.usergroups.slice(0, usergroupIndex),
          ...state.usergroups.slice(usergroupIndex + 1),
        ],
      };
    }

    case UPDATE_USERGROUP: {
      console.log('Here!');
      const { _id } = action.updateUserGroup;
      const usergroupIndex = state.usergroups.findIndex(usergroup => usergroup._id === _id);
      if (usergroupIndex === -1) return state;

      return {
        ...state,
        usergroups: [
          ...state.usergroups.slice(0, usergroupIndex),
          update(state.usergroups[usergroupIndex], { $merge: action.updateUserGroup }),
          ...state.usergroups.slice(usergroupIndex + 1),
        ],
      };
    }

    default:
      return state;
  }
}
