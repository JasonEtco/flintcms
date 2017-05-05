/* eslint-disable react/no-array-index-key */

import React, { Component, PropTypes } from 'react';

export default class FieldOptions extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
  }

  render() {
    const { fields, type } = this.props;
    return (
      <div style={{ marginTop: '2em' }}>
        <p className="input__label">{type} Options</p>
        {(fields[type].fields || []).map((F, i) => <F.type key={i} {...F} name={`options[${F.name}]`} />)}
      </div>
    );
  }
}
