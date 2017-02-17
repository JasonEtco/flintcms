import React, { Component, PropTypes } from 'react';
import './Footer.scss';

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <span>Made with <button className="emoji" onClick={}>❤️</button> on 🌏 by
          <a href="https://github.com/JasonEtco">Jason</a>
        </span>
      </footer>
    );
  }
}
