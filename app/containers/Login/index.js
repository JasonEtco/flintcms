import React, { Component } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import FlintLogo from '../../components/FlintLogo';
import './Login.scss';
import { siteLogo, siteName } from '../../../config';

export default class Login extends Component {
  state = { disableButton: true }

  componentWillMount() { document.body.classList.add('body--grey'); }
  componentWillUnmount() { document.body.classList.remove('body--grey'); }

  checkInputs = () => {
    const { email, password } = this;
    this.setState({ disableButton: !email.value || !password.value });
  }

  render() {
    return (
      <div className="login">
        {siteLogo ? <img style={{ maxWidth: '200px', margin: '1em auto' }} src={siteLogo} alt={siteName} /> : <FlintLogo />}
        <form className="login__inner" action="/admin/login" method="post">
          <Input required onChange={this.checkInputs} ref={(r) => { this.email = r; }} name="email" autoFocus big placeholder="Email" type="email" />
          <Input required onChange={this.checkInputs} ref={(r) => { this.password = r; }} name="password" big placeholder="Password" type="password" />
          <Button type="submit" disabled={this.state.disableButton}>Log In</Button>
        </form>
      </div>
    );
  }
}
