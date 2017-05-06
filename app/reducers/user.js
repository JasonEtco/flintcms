import {
  REQUEST_USER,
  RECEIVE_USER,
} from 'actions/userActions';

export default function user(state = {}, action) {
  switch (action.type) {

    case REQUEST_USER: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_USER: {
      return {
        ...state,
        ...action.user,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    default:
      return state;
  }
}
