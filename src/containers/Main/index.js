import React, { Component, PropTypes } from 'react';
import { fetchUserIfNeeded } from '../../actions/userActions';
import { fetchEntriesIfNeeded } from '../../actions/entryActions';
import { fetchSectionsIfNeeded } from '../../actions/sectionActions';
import types from '../../utils/types';
import SocketEvents from '../../utils/socketEvents';
import './Main.scss';

import Nav from '../Nav';

export default class Main extends Component {
  static propTypes = {
    ...types.entries,
    ...types.sections,
    socket: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch, socket } = this.props;

    dispatch(fetchUserIfNeeded());
    dispatch(fetchEntriesIfNeeded());
    dispatch(fetchSectionsIfNeeded());

    const events = new SocketEvents(socket, dispatch);
    events.listen();
  }

  render() {
    const { user, entries, sections } = this.props;
    if (user.isFetching || entries.isFetching || sections.isFetching) return <h1>Loading...</h1>;

    return (
      <main className="main">
        <Nav />
        <div>
          {React.cloneElement(this.props.children, {
            ...this.props,
            key: this.props.location.pathname,
          })}
        </div>
      </main>
    );
  }
}
