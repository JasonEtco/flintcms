import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { fetchUserIfNeeded, fetchUsersIfNeeded } from '../../actions/userActions';
import { fetchEntriesIfNeeded } from '../../actions/entryActions';
import { fetchSectionsIfNeeded } from '../../actions/sectionActions';
import { fetchFieldsIfNeeded } from '../../actions/fieldActions';
import types from '../../utils/types';
import SocketEvents from '../../utils/socketEvents';
import './Main.scss';

import MainNav from '../MainNav';

class Main extends Component {
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
    dispatch(fetchUsersIfNeeded());
    dispatch(fetchEntriesIfNeeded());
    dispatch(fetchSectionsIfNeeded());
    dispatch(fetchFieldsIfNeeded());

    const events = new SocketEvents(socket, dispatch);
    events.listen();
  }

  render() {
    const { user, entries, sections, fields } = this.props;
    if (user.isFetching
      || entries.isFetching
      || sections.isFetching
      || fields.isFetching) return <h1>Loading...</h1>;

    return (
      <main className="main">
        <MainNav />
        {React.cloneElement(this.props.children, {
          ...this.props,
          key: this.props.location.pathname,
        })}
      </main>
    );
  }
}

export default DragDropContext(HTML5Backend)(Main);
