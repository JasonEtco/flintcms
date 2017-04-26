import update from 'immutability-helper';
import {
  REQUEST_USERS,
  RECEIVE_USERS,
  NEW_USER,
  UPDATE_USER,
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

    case UPDATE_USER: {
      const { _id } = action.updateUser;
      const userIndex = state.users.findIndex(u => u._id === _id);
      if (userIndex === -1) return state;

      return {
        ...state,
        users: [
          ...state.users.slice(0, userIndex),
          update(state.users[userIndex], { $merge: { ...action.updateUser, full: true } }),
          ...state.users.slice(userIndex + 1),
        ],
      };
    }

    default:
      return state;
  }
}
