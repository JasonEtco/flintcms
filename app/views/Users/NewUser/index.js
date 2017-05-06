import React, { Component, PropTypes } from 'react';
import { newUser } from 'actions/userActions';
import Page from 'containers/Page';
import Input from 'components/Input';
import Button from 'components/Button';
import TitleBar from 'components/TitleBar';

export default class NewUser extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: null,
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
    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'Users', path: '/admin/settings/users' },
    ];

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
        </div>
      </Page>
    );
  }
}
