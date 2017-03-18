import {
  REQUEST_USERGROUPS,
  RECEIVE_USERGROUPS,
  NEW_USERGROUP,
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

    default:
      return state;
  }
}
