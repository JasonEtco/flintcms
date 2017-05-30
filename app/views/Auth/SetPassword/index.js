import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { post } from 'axios';
import Input from 'components/Input';
import Button from 'components/Button';
import Notification from 'components/Notification';
import LoginContainer from 'containers/LoginContainer';

export default class Login extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.checkInputs = this.checkInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = { same: true, error: false }

  checkInputs() {
    const { confirm, password } = this;
    const same = confirm.value === '' || confirm.value === password.value;
    this.setState({ same });
  }

  handleSubmit(e) {
    e.preventDefault();

    post('/admin/setpassword', {
      password: this.password.value,
      token: this.props.match.params.token,
    })
      .then(() => { this.props.history.push('/'); })
      .catch(() => { this.setState({ error: true }); });
  }

  render() {
    const { error, same } = this.state;
    return (
      <LoginContainer>
        <form className="login__inner" onSubmit={this.handleSubmit}>
          <legend className="login__title">Set a new Password</legend>
          {error && <Notification type="error">There was an error, please try again later.</Notification>}
          <Input required onChange={this.checkInputs} ref={(r) => { this.password = r; }} name="password" big placeholder="Password" type="password" />
          <Input required onChange={this.checkInputs} ref={(r) => { this.confirm = r; }} name="confirm" big placeholder="Confirm Password" type="password" />
          {!same && <Notification type="error">Your passwords are not the same!</Notification>}
          <Button type="submit" formElement disabled={!same}>Set Password</Button>
        </form>
      </LoginContainer>
    );
  }
}
