import React, { Component, PropTypes } from 'react';
import fetchData from 'actions/fetchData';
import Toast from 'components/Toast';
import SocketEvents from 'utils/socketEvents';
import t from 'utils/types';
import Icon from 'utils/icons';
import Modals from 'containers/Modals';
import './Main.scss';

import MainNav from '../MainNav';

export default class Main extends Component {
  static propTypes = {
    site: t.site,
    socket: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    user: t.user,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
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

    const isFetching = Object.keys(this.props).some(key => this.props[key].isFetching);
    if (isFetching) return null;

    return (
      <main className="main">
        <button className="nav__toggle" type="button" onClick={() => this.setState({ navIsOpen: !navIsOpen })}><Icon icon="gear" /></button>
        <MainNav siteName={site.siteName} user={user} open={navIsOpen} closeNav={this.closeNav} />

        {React.cloneElement(this.props.children, {
          ...this.props,
          key: this.props.location.pathname,
        })}

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
