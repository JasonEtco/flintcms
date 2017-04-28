import {
  REQUEST_SITE,
  RECEIVE_SITE,
  UPDATE_SITE,
} from '../actions/siteActions';
import siteConfig from '../../config';

export default function site(state = {}, action) {
  switch (action.type) {

    case REQUEST_SITE: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_SITE: {
      return {
        ...state,
        ...action.site,
        ...siteConfig,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    case UPDATE_SITE: {
      return {
        ...state,
        ...action.updateSite,
      };
    }

    default:
      return state;
  }
}
