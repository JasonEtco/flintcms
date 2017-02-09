import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import store, { history } from './utils/store';
import './main.scss';

import Main from './containers/Main';
import LoginContainer from './containers/Login';

import Home from './views/Home';
import Users from './views/Users';
import Login from './views/Login';
import Entries from './views/Entries';
import Entry from './views/Entry';
import NewSection from './views/NewSection';

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
        <Route path="entries" component={Entries} />
        <Route path="entries/:id" component={Entry} />
        <Route path="newsection" component={NewSection} />
      </Route>
      <Route path="/admin/login" component={LoginApp}>
        <IndexRoute component={Login} />
      </Route>
    </Router>
  </Provider>
);

render(storeWrapper, document.querySelector('.mount'));
