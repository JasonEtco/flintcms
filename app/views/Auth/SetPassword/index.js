import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { post } from 'axios';
import Input from 'components/Input';
import Button from 'components/Button';
import Notification from 'components/Notification';
import LoginContainer from 'containers/LoginContainer';

export default class Login extends Component {
  static propTypes = {
    params: PropTypes.shape({
      token: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.checkInputs = this.checkInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = { same: true, error: false }

  checkInputs() {
    const { confirm, password } = this;
    this.setState({ same: confirm.value === password.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { value } = this.password;

    post('/admin/setpassword', {
      password: value,
      token: this.props.params.token,
    })
      .then(() => {
        browserHistory.push('/admin/login');
      })
      .catch(() => {
        this.setState({ error: true });
      });
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
