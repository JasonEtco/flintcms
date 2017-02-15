import React, { Component, PropTypes } from 'react';
import Input from '../../Input';

export default class Text extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }

  render() {
    const { slug, title } = this.props;

    return <Input name={slug} label={title} full />;
  }
}

