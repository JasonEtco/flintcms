import React, { Component } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import FlintLogo from '../../components/FlintLogo';
import './Login.scss';

export default class Login extends Component {
  state = { disableButton: true }

  componentWillMount() { document.body.classList.add('body--grey'); }
  componentWillUnmount() { document.body.classList.remove('body--grey'); }

  checkInputs = () => {
    const { username, password } = this;
    this.setState({ disableButton: !username.value || !password.value });
  }

  render() {
    return (
      <div className="login">
        <FlintLogo />
        <form className="login__inner" action="/admin/login" method="post">
          <Input required onChange={this.checkInputs} ref={(r) => { this.username = r; }} name="username" autoFocus big placeholder="Username" />
          <Input required onChange={this.checkInputs} ref={(r) => { this.password = r; }} name="password" big placeholder="Password" type="password" />
          <Button type="submit" disabled={this.state.disableButton}>Log In</Button>
        </form>
      </div>
    );
  }
}
