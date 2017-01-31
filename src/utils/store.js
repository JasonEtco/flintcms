import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';


const defaultState = {};

const enhancers = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
);

const store = createStore(
  rootReducer,
  defaultState,
  enhancers,
);

export default store;
