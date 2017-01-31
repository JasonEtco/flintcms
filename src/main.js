import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import store, { history } from './utils/store';

export default function mapStateToProps(state) {
  return { ...state };
}

const App = <div>App!</div>;

const Root = connect(mapStateToProps)(App);

const storeWrapper = (
  <Provider store={store}>
    <Router history={history}>
      <IndexRoute component={Root} />
      <Route path="test" component={Root} />
    </Router>
  </Provider>
);

render(storeWrapper, document.querySelector('.mount'));
