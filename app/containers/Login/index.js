import React, { Component } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import FlintLogo from '../../components/FlintLogo';
import './Login.scss';
import graphFetcher from '../../utils/graphFetcher';
import { siteName } from '../../../config';

export default class Login extends Component {
  state = { disableButton: true }

  componentWillMount() { document.body.classList.add('body--grey'); }
  componentDidMount() {
    graphFetcher('{ site { siteLogo } }').then(({ data }) => {
      this.setState({ siteLogo: data.data.site.siteLogo });
    });
  }
  componentWillUnmount() { document.body.classList.remove('body--grey'); }


  checkInputs = () => {
    const { email, password } = this;
    this.setState({ disableButton: !email.value || !password.value });
  }

  render() {
    const { siteLogo } = this.state;
    return (
      <div className="login">
        {siteLogo ? <img style={{ maxWidth: '420px', maxHeight: '200px', margin: '1em auto' }} src={`/public/assets/${siteLogo.filename}`} alt={siteName} /> : <FlintLogo width={140} height={80} />}
        <form className="login__inner" action="/admin/login" method="post">
          <Input required onChange={this.checkInputs} ref={(r) => { this.email = r; }} name="email" autoFocus big placeholder="Email" type="email" />
          <Input required onChange={this.checkInputs} ref={(r) => { this.password = r; }} name="password" big placeholder="Password" type="password" />
          <Button type="submit" disabled={this.state.disableButton}>Log In</Button>
        </form>
        {siteLogo && <FlintLogo poweredBy width={100} height={25} />}
      </div>
    );
  }
}
