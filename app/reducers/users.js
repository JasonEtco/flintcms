import {
  REQUEST_USERS,
  RECEIVE_USERS,
  NEW_USER,
} from '../actions/userActions';

export default function users(state = {}, action) {
  switch (action.type) {

    case REQUEST_USERS: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_USERS: {
      return {
        ...state,
        users: action.users,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    case NEW_USER: {
      return {
        ...state,
        users: [
          ...state.users,
          action.addUser,
        ],
      };
    }

    default:
      return state;
  }
}
