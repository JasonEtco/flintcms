import React, { Component } from 'react';
import Input from '../../modules/Input';

export default class Login extends Component {
  render() {
    return (
      <div>
        <form action="/admin/login" method="post">
          <div>
            <label>Username:</label>
            <Input name="username" />
          </div>
          <div>
            <label>Password:</label>
            <Input type="password" name="password" />
          </div>
          <div>
            <input type="submit" value="Log In" />
          </div>
        </form>

        <form action="/admin/signup" method="post">
          <div>
            <label>Username:</label>
            <Input name="username" />
          </div>
          <div>
            <label>Password:</label>
            <Input type="password" name="password" />
          </div>
          <div>
            <input type="submit" value="Sign Up" />
          </div>
        </form>
      </div>
    );
  }
}
