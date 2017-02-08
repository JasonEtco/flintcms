import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import rootReducer from './rootReducer';


const defaultState = {
  user: { isFetching: true },
  entries: { isFetching: true },
};
const routerMiddle = routerMiddleware(browserHistory);

const enhancers = compose(
  applyMiddleware(thunk, routerMiddle),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
);

const store = createStore(
  rootReducer,
  defaultState,
  enhancers,
);
export const history = syncHistoryWithStore(browserHistory, store);

export default store;
