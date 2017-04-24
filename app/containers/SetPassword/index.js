import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Notification from '../../components/Notification';
import FlintLogo from '../../components/FlintLogo';
import graphFetcher from '../../utils/graphFetcher';

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

  componentWillMount() { document.body.classList.add('body--grey'); }
  componentWillUnmount() { document.body.classList.remove('body--grey'); }

  checkInputs() {
    const { confirm, password } = this;
    this.setState({ same: confirm.value === password.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { value } = this.password;

    const query = `mutation ($token: String!, $password: String!) {
      setPassword (token: $token, password: $password) {
        _id
      }
    }`;

    const variables = {
      password: value,
      token: this.props.params.token,
    };

    graphFetcher(query, variables)
      .then((res) => {
        if (!res.data.errors) {
          browserHistory.push('/admin/login');
        }
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  render() {
    const { error, same } = this.state;
    return (
      <div className="login">
        <FlintLogo />
        <form className="login__inner" onSubmit={this.handleSubmit}>
          <legend className="login__title">Set a new Password</legend>
          {error && <Notification type="error">There was an error, please try again later</Notification>}
          <Input required onChange={this.checkInputs} ref={(r) => { this.password = r; }} name="password" big placeholder="Password" type="password" />
          <Input required onChange={this.checkInputs} ref={(r) => { this.confirm = r; }} name="confirm" big placeholder="Confirm Password" type="password" />
          {!same && <Notification type="error">Your passwords are not the same!</Notification>}
          <Button type="submit" formElement disabled={!same}>Set Password</Button>
        </form>
      </div>
    );
  }
}
