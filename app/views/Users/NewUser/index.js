import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { newUser } from 'actions/userActions';
import Page from 'containers/Page';
import Input from 'components/Input';
import Dropdown from 'components/Fields/Dropdown';
import Button from 'components/Button';
import TitleBar from 'components/TitleBar';
import Aside from 'containers/Aside';
import t from 'utils/types';
import { arrayMove } from 'utils/helpers';

export default class NewUser extends Component {
  static propTypes = {
    usergroups: t.usergroups.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { username, first, last, email } = this;
    this.props.dispatch(newUser({
      username: username.value,
      email: email.value,
      name: {
        first: first.value,
        last: last.value,
      },
    }));
  }

  render() {
    const { usergroups } = this.props.usergroups;

    const links = [
      { label: 'Settings', path: '/settings' },
      { label: 'Users', path: '/settings/users' },
    ];

    const adminIndex = usergroups.findIndex(u => u.slug === 'admin');
    const orderedUsergroups = arrayMove(usergroups, adminIndex, 0);
    const formattedUsergroups = orderedUsergroups.map(u => ({ label: u.title, value: u._id }));

    return (
      <Page name="new-user" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title="New User">
          <Button onClick={this.onSubmit} small>Save</Button>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            <Input
              name="email"
              label="Email"
              type="email"
              ref={(r) => { this.email = r; }}
              required
              full
            />

            <Input
              name="username"
              label="Username"
              ref={(r) => { this.username = r; }}
              required
              full
            />

            <Input
              name="first"
              label="First Name"
              ref={(r) => { this.first = r; }}
              full
            />

            <Input
              name="last"
              label="Last Name"
              ref={(r) => { this.last = r; }}
              full
            />
          </div>

          <Aside noStatus>
            <Dropdown
              label="Usergroup"
              name="usergroup"
              full
              options={formattedUsergroups}
            />
          </Aside>
        </div>
      </Page>
    );
  }
}
