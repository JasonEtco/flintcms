import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { get } from 'axios';
import FlintLogo from 'components/FlintLogo';
import './LoginContainer.scss';
import { siteName } from '../../../config';

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
        {siteLogo ? <img style={{ maxWidth: '420px', maxHeight: '200px', margin: '1em auto' }} src={`/public/assets/${siteLogo.filename}`} alt={siteName} /> : <FlintLogo width={140} height={80} />}
        {children}
        <Link to="/admin/fp" className="login__forgot">Forgot your password?</Link>
        {siteLogo && <FlintLogo poweredBy width={100} height={25} />}
      </div>
    );
  }
}
