import { REQUEST_PLUGINS, RECEIVE_PLUGINS } from 'actions/pluginActions';

export default function plugins(state = {}, action) {
  switch (action.type) {

    case REQUEST_PLUGINS: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_PLUGINS: {
      return {
        ...state,
        plugins: action.plugins,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    default:
      return state;
  }
}
