import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import store, { history } from './utils/store';

import Main from './components/containers/Main';
import LoginContainer from './components/containers/Login';

import Home from './components/views/Home';
import Users from './components/views/Users';
import Login from './components/views/Login';

export default function mapStateToProps(state) {
  return { ...state };
}

const App = connect(mapStateToProps)(Main);
const LoginApp = connect(mapStateToProps)(LoginContainer);

const storeWrapper = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/admin" component={App}>
        <IndexRoute component={Home} />
        <Route path="users" component={Users} />
      </Route>
      <Route path="/admin/login" component={LoginContainer}>
        <IndexRoute component={Login} />
      </Route>
    </Router>
  </Provider>
);

render(storeWrapper, document.querySelector('.mount'));
