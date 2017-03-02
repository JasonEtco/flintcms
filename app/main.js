import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import store, { history } from './utils/store';
import './main.scss';

import Main from './containers/Main';

import Home from './views/Home';
import FourOhFour from './views/404';

import Users from './views/Users';
import Login from './containers/Login';

import Entry from './views/Entry';
import Entries from './views/Entries';
import NewEntry from './views/NewEntry';

import Section from './views/Section';
import Sections from './views/Sections';
import NewSection from './views/NewSection';

import Field from './views/Field';
import Fields from './views/Fields';
import NewField from './views/NewField';

import Assets from './views/Assets';
import NewAsset from './views/NewAsset';

import Settings from './views/Settings';

export default function mapStateToProps(state) {
  return { ...state };
}

const App = connect(mapStateToProps)(Main);

const storeWrapper = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/admin" component={App}>
        <IndexRoute component={Home} />
        <Route path="users" component={Users} />

        <Route path="entries(/:section)" component={Entries} />
        <Route path="entries/:section/new" component={NewEntry} />
        <Route path="entries/:section/:id" component={Entry} />

        <Route path="settings" component={Settings} />
        <Route path="settings/sections" component={Sections} />
        <Route path="settings/sections/new" component={NewSection} />
        <Route path="settings/sections/:slug" component={Section} />

        <Route path="settings/fields" component={Fields} />
        <Route path="settings/fields/new" component={NewField} />
        <Route path="settings/fields/:id" component={Field} />

        <Route path="settings/assets" component={Assets} />
        <Route path="settings/assets/new" component={NewAsset} />
      </Route>
      <Route path="/admin/login" component={Login} />

      <Route path="*" component={FourOhFour} />
    </Router>
  </Provider>
);

render(storeWrapper, document.querySelector('.mount'));
