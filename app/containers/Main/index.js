import React, { Component, PropTypes } from 'react';
import { fetchUserIfNeeded, fetchUsersIfNeeded } from '../../actions/userActions';
import { fetchEntriesIfNeeded } from '../../actions/entryActions';
import { fetchSectionsIfNeeded } from '../../actions/sectionActions';
import { fetchFieldsIfNeeded } from '../../actions/fieldActions';
import { fetchAssetsIfNeeded } from '../../actions/assetActions';
import Toast from '../../components/Toast';
import types from '../../utils/types';
import SocketEvents from '../../utils/socketEvents';
import './Main.scss';

import MainNav from '../MainNav';

export default class Main extends Component {
  static propTypes = {
    ...types.entries,
    ...types.sections,
    socket: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch, socket } = this.props;

    dispatch(fetchUserIfNeeded());
    dispatch(fetchUsersIfNeeded());
    dispatch(fetchEntriesIfNeeded());
    dispatch(fetchSectionsIfNeeded());
    dispatch(fetchFieldsIfNeeded());
    dispatch(fetchAssetsIfNeeded());

    const events = new SocketEvents(socket, dispatch);
    events.listen();
  }

  render() {
    const { user, entries, sections, fields, assets, ui, dispatch } = this.props;
    if (user.isFetching
      || entries.isFetching
      || sections.isFetching
      || assets.isFetching
      || fields.isFetching) return null;

    return (
      <main className="main">
        <MainNav />
        {React.cloneElement(this.props.children, {
          ...this.props,
          key: this.props.location.pathname,
        })}

        <div className="toasts">
          {ui.toasts.map(t => <Toast dispatch={dispatch} key={t.dateCreated} {...t} />)}
        </div>
      </main>
    );
  }
}
