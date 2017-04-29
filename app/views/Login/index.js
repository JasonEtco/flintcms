import React, { Component } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoginContainer from '../../containers/LoginContainer';

export default class ComponentName extends Component {
  constructor(props) {
    super(props);
    this.checkInputs = this.checkInputs.bind(this);
  }

  state = { disableButton: true }

  checkInputs() {
    const { email, password } = this;
    this.setState({ disableButton: !email.value || !password.value });
  }

  render() {
    return (
      <LoginContainer>
        <form className="login__inner" action="/admin/login" method="post">
          <Input required onChange={this.checkInputs} ref={(r) => { this.email = r; }} name="email" autoFocus big placeholder="Email" type="email" />
          <Input required onChange={this.checkInputs} ref={(r) => { this.password = r; }} name="password" big placeholder="Password" type="password" />
          <Button type="submit" disabled={this.state.disableButton}>Log In</Button>
        </form>
      </LoginContainer>
    );
  }
}
