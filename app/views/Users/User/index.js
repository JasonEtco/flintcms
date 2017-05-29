import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { updateUser, userDetails, sendPasswordReset } from 'actions/userActions';
import Page from 'containers/Page';
import Input from 'components/Input';
import Button from 'components/Button';
import TitleBar from 'components/TitleBar';
import Aside from 'containers/Aside';
import t from 'utils/types';
import { withRouter } from 'react-router';

export default withRouter(class User extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    users: t.users,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  static defaultProps = {
    dispatch: null,
    users: null,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { dispatch, match, users } = this.props;
    const { full } = users.users.find(e => e._id === match.params.id);
    if (!full || full === undefined) {
      dispatch(userDetails(match.params.id));
    }
  }

  onSubmit() {
    const { username, first, last, email, props } = this;
    this.props.dispatch(updateUser(props.match.params.id, {
      username: username.value,
      email: email.value,
      name: {
        first: first.value,
        last: last.value,
      },
    }));
  }

  sendPasswordReset() {
    const { id } = this.props.match.params;
    this.props.dispatch(sendPasswordReset(id));
  }

  render() {
    const { users, match } = this.props;
    const user = users.users.find(u => u._id === match.params.id);

    if (user.full === undefined) return null;

    const userTitle = user.name.first ? `${user.name.first} ${user.name.last}` : user.email;

    const links = [
      { label: 'Users', path: '/users' },
      { label: userTitle, path: `/users/${match.params.id}` },
    ];

    return (
      <Page name="user" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title={userTitle}>
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
              defaultValue={user.email}
            />

            <Input
              name="username"
              label="Username"
              ref={(r) => { this.username = r; }}
              required
              full
              readOnly
              defaultValue={user.username}
            />

            <Input
              name="first"
              label="First Name"
              ref={(r) => { this.first = r; }}
              full
              defaultValue={user.name.first}
            />

            <Input
              name="last"
              label="Last Name"
              ref={(r) => { this.last = r; }}
              full
              defaultValue={user.name.last}
            />
          </div>

          <Aside noStatus dateCreated={user.dateCreated}>
            <Button small formElement onClick={this.sendPasswordReset}>Reset Password</Button>
          </Aside>
        </div>
      </Page>
    );
  }
});
