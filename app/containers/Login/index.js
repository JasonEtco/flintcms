import React, { Component } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import FlintLogo from '../../components/FlintLogo';
import './Login.scss';

export default class Login extends Component {
  componentWillMount() { document.body.classList.add('body--blue'); }
  componentWillUnmount() { document.body.classList.remove('body--blue'); }

  render() {
    return (
      <div className="login">
        <FlintLogo />
        <form className="login__inner" action="/admin/login" method="post">
          <h1>Log In</h1>
          <Input name="username" autoFocus big placeholder="Username" />
          <Input name="password" big placeholder="Password" type="password" />
          <Button type="submit">Log In</Button>
        </form>
      </div>
    );
  }
}
