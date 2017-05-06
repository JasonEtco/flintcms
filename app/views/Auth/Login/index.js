import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { post } from 'axios';
import { getUrlParameter } from '../../../utils/helpers';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import LoginContainer from '../../../containers/LoginContainer';

export default class ComponentName extends Component {
  constructor(props) {
    super(props);
    this.checkInputs = this.checkInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = { disableButton: true }

  checkInputs() {
    const { email, password } = this;
    this.setState({ disableButton: !email.value || !password.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    post('/admin/login', {
      email: this.email.value,
      password: this.password.value,
    })
      .then(() => {
        const path = getUrlParameter('p');
        if (path) {
          browserHistory.push(path);
        } else {
          browserHistory.push('/admin');
        }
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  render() {
    return (
      <LoginContainer>
        <form className="login__inner" onSubmit={this.handleSubmit}>
          <Input required onChange={this.checkInputs} ref={(r) => { this.email = r; }} name="email" autoFocus big placeholder="Email" type="email" />
          <Input required onChange={this.checkInputs} ref={(r) => { this.password = r; }} name="password" big placeholder="Password" type="password" />
          <Button type="submit" disabled={this.state.disableButton}>Log In</Button>
        </form>
      </LoginContainer>
    );
  }
}
