import React, { Component } from 'react';

export default class Login extends Component {
  render() {
    return (
      <div>
        <form action="/admin/login" method="post">
          <div>
            <label>Username:</label>
            <input type="text" name="username" />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" />
          </div>
          <div>
            <input type="submit" value="Log In" />
          </div>
        </form>

        <form action="/admin/signup" method="post">
          <div>
            <label>Username:</label>
            <input id="username" type="text" name="username" />
          </div>
          <div>
            <label>Password:</label>
            <input id="password" type="password" name="password" />
          </div>
          <div>
            <input type="submit" value="Sign Up" />
          </div>
        </form>
      </div>
    );
  }
}
