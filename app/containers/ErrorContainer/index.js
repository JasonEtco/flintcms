import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getUrlParameter } from 'utils/helpers';
import Icon from 'utils/icons';
import './ErrorContainer.scss';

export default class ErrorContainer extends Component {
  componentDidMount() { document.body.classList.add('body--grey'); }
  componentWillUnmount() { document.body.classList.remove('body--grey'); }

  render() {
    const reason = getUrlParameter('r');
    const page = getUrlParameter('p');
    const template = getUrlParameter('t');

    let str;

    /* eslint-disable max-len */
    switch (reason) {
      case 'no-template':
        str = <span>The requested template <strong>{template}.njk</strong> was not found when the <strong>{page}</strong> page was requested.</span>;
        break;
      case 'no-html':
        str = <span>There was an error when compiling the template for the <strong>{page}</strong> page was requested.</span>;
        break;
      case 'no-homepage':
        str = <span>Your website does not have a homepage yet! You can create one by <Link to="/settings/pages/new">signing in to the admin dashboard.</Link></span>;
        break;
      default:
        str = <span>Unknown error!</span>;
    }
    /* eslint-enable max-len */

    return (
      <div className="error-page">
        <div className="error-page__inner">
          <Icon icon="warning" />
          {str}
        </div>
      </div>
    );
  }
}
