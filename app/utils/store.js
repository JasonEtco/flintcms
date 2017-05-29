import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import rootReducer from './rootReducer';


const defaultState = {
  user: { isFetching: true },
  users: { isFetching: true },
  entries: { isFetching: true },
  sections: { isFetching: true },
  assets: { isFetching: true },
  site: { isFetching: true },
  plugins: { isFetching: true },
  ui: {
    toasts: [],
    modalIsOpen: false,
  },
};
export const history = createHistory({ basename: '/admin' });
const routerMiddle = routerMiddleware(history);

const enhancers = compose(
  applyMiddleware(thunk, routerMiddle),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
);

const store = createStore(
  rootReducer,
  defaultState,
  enhancers,
);

export default store;
