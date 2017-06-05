import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get, post } from 'axios';
import Input from 'components/Input';
import Button from 'components/Button';
import Notification from 'components/Notification';
import FlintLogo from 'components/FlintLogo';
import './Install.scss';

export default class Install extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = { same: true, error: false }

  componentWillMount() { document.body.classList.add('body--grey'); }

  componentDidMount() {
    get('/admin/firstinstall')
      .then((res) => {
        if (res.data.aUserExists) {
          this.props.history.push('/login');
        }
      })
      .catch(err => new Error(err));
  }

  componentWillUnmount() { document.body.classList.remove('body--grey'); }

  handleSubmit(e) {
    e.preventDefault();

    post('/admin/firstuser', {
      email: this.email.value,
      username: this.username.value,
      password: this.password.value,
      name: {
        first: this.first.value,
        last: this.last.value,
      },
    })
      .then(() => { this.props.history.push('/'); })
      .catch(() => { this.setState({ error: true }); });
  }

  render() {
    const { error, same } = this.state;
    return (
      <div className="install">
        <div className="install__inner">
          <div className="install__col">
            <FlintLogo />
            <h1 className="install__title">Welcome to Flint!</h1>
            <p>Seeing this page means that you&apos;ve just started your Flint site for the first time and need to make a user account.</p>
          </div>
          <form className="install__form" onSubmit={this.handleSubmit}>
            {error && <Notification type="error">An error occured!</Notification>}
            {!same && <Notification type="error">Your passwords are not the same!</Notification>}
            <Input full required ref={(r) => { this.email = r; }} name="email" label="Email" placeholder="Email" type="email" />
            <Input full required ref={(r) => { this.username = r; }} name="username" instructions="How others will see you in the admin dashboard." label="Username" placeholder="Username" />
            <Input full required ref={(r) => { this.password = r; }} name="password" label="Password" placeholder="Password" type="password" />
            <div className="input-group form-element">
              <Input ref={(r) => { this.first = r; }} name="first" label="First Name" placeholder="First Name" />
              <Input ref={(r) => { this.last = r; }} name="last" label="Last Name" placeholder="Last Name" />
            </div>
            <Button type="submit" formElement>Create Account</Button>
          </form>
        </div>
      </div>
    );
  }
}
