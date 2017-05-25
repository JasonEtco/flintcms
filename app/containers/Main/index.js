import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import fetchData from 'actions/fetchData';
import Toast from 'components/Toast';
import SocketEvents from 'utils/socketEvents';
import t from 'utils/types';
import Icon from 'utils/icons';
import Modals from 'containers/Modals';

import Home from 'views/Home';

import User from 'views/Users/User';
import Users from 'views/Users/Users';
import NewUser from 'views/Users/NewUser';

import Entry from 'views/Entries/Entry';
import Entries from 'views/Entries/Entries';
import NewEntry from 'views/Entries/NewEntry';

import Section from 'views/Sections/Section';
import Sections from 'views/Sections/Sections';
import NewSection from 'views/Sections/NewSection';

import UserGroup from 'views/UserGroups/UserGroup';
import UserGroups from 'views/UserGroups/UserGroups';
import NewUserGroup from 'views/UserGroups/NewUserGroup';

import Field from 'views/Fields/Field';
import Fields from 'views/Fields/Fields';
import NewField from 'views/Fields/NewField';

import Asset from 'views/Assets/Asset';
import Assets from 'views/Assets/Assets';
import NewAsset from 'views/Assets/NewAsset';

import Settings from 'views/Settings';
import Site from 'views/Settings/Site';
import Styles from 'views/Settings/Styles';
import Plugins from 'views/Settings/Plugins';

import FourOhFour from 'views/404';

import './Main.scss';
import MainNav from '../MainNav';

export default class Main extends Component {
  static propTypes = {
    site: t.site,
    socket: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    user: t.user,
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    site: null,
    user: null,
  }

  state = { navIsOpen: false }

  componentDidMount() {
    const { dispatch, socket } = this.props;

    fetchData();

    const events = new SocketEvents(socket, dispatch);
    events.listen();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location.pathname !== this.props.location.pathname) {
      this.setState({ navIsOpen: false });
    }
  }

  render() {
    const { ui, dispatch, site, user } = this.props;
    const { navIsOpen } = this.state;

    const isFetching = Object.keys(this.props).some(key =>
      this.props[key] && this.props[key].isFetching);

    if (isFetching) return null;

    return (
      <main className="main">
        <button className="nav__toggle" type="button" onClick={() => this.setState({ navIsOpen: !navIsOpen })}><Icon icon="gear" /></button>
        <MainNav siteName={site.siteName} user={user} open={navIsOpen} closeNav={this.closeNav} />

        <Switch>
          <Route exact path="/" render={props => <Home {...props} {...this.props} />} />
          <Route exact path="/users" render={props => <Users {...props} {...this.props} />} />
          <Route exact path="/users/new" render={props => <NewUser {...props} {...this.props} />} />
          <Route path="/users/:id" render={props => <User {...props} {...this.props} />} />

          <Route path="/entries/:section/new" render={props => <NewEntry {...props} {...this.props} />} />
          <Route path="/entries/:section/:id" render={props => <Entry {...props} {...this.props} />} />
          <Route path="/entries/:section?" render={props => <Entries {...props} {...this.props} />} />

          <Route exact path="/settings" render={props => <Settings {...props} {...this.props} />} />
          <Route exact path="/settings/sections" render={props => <Sections {...props} {...this.props} />} />
          <Route exact path="/settings/sections/new" render={props => <NewSection {...props} {...this.props} />} />
          <Route path="/settings/sections/:slug" render={props => <Section {...props} {...this.props} />} />

          <Route exact path="/settings/usergroups" render={props => <UserGroups {...props} {...this.props} />} />
          <Route exact path="/settings/usergroups/new" render={props => <NewUserGroup {...props} {...this.props} />} />
          <Route path="/settings/usergroups/:slug" render={props => <UserGroup {...props} {...this.props} />} />

          <Route exact path="/settings/fields" render={props => <Fields {...props} {...this.props} />} />
          <Route exact path="/settings/fields/new" render={props => <NewField {...props} {...this.props} />} />
          <Route path="/settings/fields/:id" render={props => <Field {...props} {...this.props} />} />

          <Route path="/settings/assets" render={props => <Assets {...props} {...this.props} />} />
          <Route path="/settings/assets/new" render={props => <NewAsset {...props} {...this.props} />} />
          <Route path="/settings/assets/:id" render={props => <Asset {...props} {...this.props} />} />

          <Route path="/settings/general" render={props => <Site {...props} {...this.props} />} />
          <Route path="/settings/styles" render={props => <Styles {...props} {...this.props} />} />
          <Route path="/settings/plugins" render={props => <Plugins {...props} {...this.props} />} />

          <Route path="*" component={FourOhFour} />
        </Switch>

        <div className="toasts">
          {ui.toasts.map(toast => <Toast dispatch={dispatch} key={toast.dateCreated} {...toast} />)}
        </div>

        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          className="nav__toggle-overlay"
          onClick={() => this.setState({ navIsOpen: false })}
        />
        <Modals {...this.props} />
      </main>
    );
  }
}
