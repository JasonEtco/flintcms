import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import store, { history } from './utils/store';
import './main.scss';

import Main from './containers/Main';

import Home from './views/Home';
import FourOhFour from './views/404';

import Login from './views/Login';
import SetPassword from './views/SetPassword';

import User from './views/Users/User';
import Users from './views/Users/Users';
import NewUser from './views/Users/NewUser';

import Entry from './views/Entries/Entry';
import Entries from './views/Entries/Entries';
import NewEntry from './views/Entries/NewEntry';

import Section from './views/Sections/Section';
import Sections from './views/Sections/Sections';
import NewSection from './views/Sections/NewSection';

import UserGroup from './views/UserGroups/UserGroup';
import UserGroups from './views/UserGroups/UserGroups';
import NewUserGroup from './views/UserGroups/NewUserGroup';

import Field from './views/Fields/Field';
import Fields from './views/Fields/Fields';
import NewField from './views/Fields/NewField';

import Asset from './views/Assets/Asset';
import Assets from './views/Assets/Assets';
import NewAsset from './views/Assets/NewAsset';

import Settings from './views/Settings';
import Site from './views/Site';
import Styles from './views/Styles';

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
        <Route path="users/new" component={NewUser} />
        <Route path="users/:id" component={User} />

        <Route path="entries(/:section)" component={Entries} />
        <Route path="entries/:section/new" component={NewEntry} />
        <Route path="entries/:section/:id" component={Entry} />

        <Route path="settings" component={Settings} />
        <Route path="settings/sections" component={Sections} />
        <Route path="settings/sections/new" component={NewSection} />
        <Route path="settings/sections/:slug" component={Section} />

        <Route path="settings/usergroups" component={UserGroups} />
        <Route path="settings/usergroups/new" component={NewUserGroup} />
        <Route path="settings/usergroups/:slug" component={UserGroup} />

        <Route path="settings/fields" component={Fields} />
        <Route path="settings/fields/new" component={NewField} />
        <Route path="settings/fields/:id" component={Field} />

        <Route path="settings/assets" component={Assets} />
        <Route path="settings/assets/new" component={NewAsset} />
        <Route path="settings/assets/:id" component={Asset} />

        <Route path="settings/general" component={Site} />
        <Route path="settings/styles" component={Styles} />
      </Route>

      <Route path="/admin/login" component={Login} />
      <Route path="/admin/sp/:token" component={SetPassword} />

      <Route path="*" component={FourOhFour} />
    </Router>
  </Provider>
);

render(storeWrapper, document.querySelector('.mount'));
