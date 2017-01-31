import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import store, { history } from './utils/store';

import Main from './components/containers/Main';

import Home from './components/views/Home';
import Users from './components/views/Users';

export default function mapStateToProps(state) {
  return { ...state };
}

const App = connect(mapStateToProps)(Main);

const storeWrapper = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="users" component={Users} />
      </Route>
    </Router>
  </Provider>
);

render(storeWrapper, document.querySelector('.mount'));
