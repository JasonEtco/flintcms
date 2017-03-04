import {
  REQUEST_ASSETS,
  RECEIVE_ASSETS,
  NEW_ASSET,
} from '../actions/assetActions';

export default function assets(state = {}, action) {
  switch (action.type) {

    case REQUEST_ASSETS: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_ASSETS: {
      return {
        ...state,
        assets: action.assets,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    case NEW_ASSET: {
      return {
        ...state,
        assets: [
          ...state.assets,
          action.addAsset,
        ],
      };
    }

    default:
      return state;
  }
}
