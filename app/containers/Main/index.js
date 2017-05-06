import React, { Component, PropTypes } from 'react';
import fetchData from 'actions/fetchData';
import Toast from 'components/Toast';
import SocketEvents from 'utils/socketEvents';
import t from 'utils/types';
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

  componentDidMount() {
    const { dispatch, socket } = this.props;

    fetchData();

    const events = new SocketEvents(socket, dispatch);
    events.listen();
  }

  render() {
    const { ui, dispatch, site, user } = this.props;

    const isFetching = Object.keys(this.props).some(key => this.props[key].isFetching);
    if (isFetching) return null;

    return (
      <main className="main">
        <MainNav siteName={site.siteName} user={user} />
        {React.cloneElement(this.props.children, {
          ...this.props,
          key: this.props.location.pathname,
        })}

        <div className="toasts">
          {ui.toasts.map(toast => <Toast dispatch={dispatch} key={toast.dateCreated} {...toast} />)}
        </div>
        <Modals {...this.props} />
      </main>
    );
  }
}
