import update from 'immutability-helper';
import {
  REQUEST_PAGES,
  RECEIVE_PAGES,
  NEW_PAGE,
  UPDATE_PAGE,
  DELETE_PAGE,
} from 'actions/pageActions';

export default function pages(state = {}, action) {
  switch (action.type) {

    case REQUEST_PAGES: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }

    case RECEIVE_PAGES: {
      return {
        ...state,
        pages: action.pages,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
      };
    }

    case NEW_PAGE: {
      const pageIndex = state.pages.findIndex(page => page._id === action.addPage._id);
      if (pageIndex !== -1) return state;

      const homepageIndex = state.pages.findIndex(page => page.homepage);
      if (action.addPage.homepage && homepageIndex !== -1) {
        return {
          ...state,
          pages: [
            ...state.pages.slice(0, homepageIndex),
            update(state.pages[homepageIndex], { $merge: { homepage: false } }),
            ...state.pages.slice(homepageIndex + 1),
            { ...action.addPage, full: true },
          ],
        };
      }

      return {
        ...state,
        pages: [
          ...state.pages,
          { ...action.addPage, full: true },
        ],
      };
    }

    case DELETE_PAGE: {
      const pageIndex = state.pages.findIndex(page => page._id === action.id);
      if (pageIndex === -1) return state;

      return {
        ...state,
        pages: [
          ...state.pages.slice(0, pageIndex),
          ...state.pages.slice(pageIndex + 1),
        ],
      };
    }

    case UPDATE_PAGE: {
      const { _id } = action.updatePage;
      const pageIndex = state.pages.findIndex(page => page._id === _id);
      if (pageIndex === -1) return state;

      return {
        ...state,
        pages: [
          ...state.pages.slice(0, pageIndex),
          update(state.pages[pageIndex], { $merge: { ...action.updatePage, full: true } }),
          ...state.pages.slice(pageIndex + 1),
        ],
      };
    }

    default:
      return state;
  }
}
