import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'axios';
import FlintLogo from 'components/FlintLogo';
import './LoginContainer.scss';

export default class LoginContainer extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  }

  state = { siteLogo: null, isFetching: true }

  componentWillMount() { document.body.classList.add('body--grey'); }

  componentDidMount() {
    get('/admin/api/site').then(({ data }) => {
      this.setState({ siteLogo: data.siteLogo, isFetching: false });
    });
  }

  componentWillUnmount() { document.body.classList.remove('body--grey'); }

  render() {
    const { siteLogo, isFetching } = this.state;
    const { children } = this.props;

    if (isFetching) return null;

    return (
      <div className="login">
        {siteLogo ? <img className="login__img" src={`/public/assets/${siteLogo.filename}`} alt={siteLogo.filename} /> : <FlintLogo width={140} height={80} />}
        {children}
        <Link to="/fp" className="login__forgot">Forgot your password?</Link>
        {siteLogo && <FlintLogo poweredBy width={100} height={25} />}
      </div>
    );
  }
}
