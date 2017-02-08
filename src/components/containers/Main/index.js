import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { fetchUserIfNeeded } from '../../../actions/userActions';
import { fetchEntriesIfNeeded } from '../../../actions/entryActions';
import types from '../../types';

export default class Main extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    ...types.entries,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchUserIfNeeded());
    this.props.dispatch(fetchEntriesIfNeeded());
  }

  render() {
    const { user, entries } = this.props;
    if (user.isFetching && entries.isFetching) return <h1>Loading...</h1>;

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
