import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { fetchUserIfNeeded } from '../../actions/userActions';
import { fetchEntriesIfNeeded } from '../../actions/entryActions';
import { fetchSectionsIfNeeded } from '../../actions/sectionActions';
import types from '../../utils/types';

export default class Main extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    ...types.entries,
    ...types.fetchSectionsIfNeeded,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchUserIfNeeded());
    this.props.dispatch(fetchEntriesIfNeeded());
    this.props.dispatch(fetchSectionsIfNeeded());
  }

  render() {
    const { user, entries, sections } = this.props;
    if (user.isFetching || entries.isFetching || sections.isFetching) return <h1>Loading...</h1>;

    return (
      <div>
        Main! Hi {this.props.user.username}

        <Link to="/admin/entries">Entries</Link>
        <div>
          {React.cloneElement(this.props.children, {
            ...this.props,
            key: this.props.location.pathname,
          })}
        </div>
      </div>
    );
  }
}
