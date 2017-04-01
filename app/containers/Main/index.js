import React, { Component, PropTypes } from 'react';
import fetchData from '../../actions/fetchData';
import Toast from '../../components/Toast';
import Modals from '../Modals';
import types from '../../utils/types';
import SocketEvents from '../../utils/socketEvents';
import './Main.scss';

import MainNav from '../MainNav';

export default class Main extends Component {
  static propTypes = {
    ...types.entries,
    ...types.sections,
    site: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch, socket } = this.props;

    fetchData();

    const events = new SocketEvents(socket, dispatch);
    events.listen();
  }

  render() {
    const { ui, dispatch, site } = this.props;
    if (Object.keys(this.props).some(key => this.props[key].isFetching)) return null;

    return (
      <main className="main">
        <MainNav siteName={site.siteName} />
        {React.cloneElement(this.props.children, {
          ...this.props,
          key: this.props.location.pathname,
        })}

        <div className="toasts">
          {ui.toasts.map(t => <Toast dispatch={dispatch} key={t.dateCreated} {...t} />)}
        </div>
        <Modals {...this.props} />
      </main>
    );
  }
}
