/* eslint-disable react/no-array-index-key */

import React, { Component, PropTypes } from 'react';

export default class FieldOptions extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    field: PropTypes.object,
    type: PropTypes.string.isRequired,
  }

  static defaultProps = {
    field: null,
  }

  render() {
    const { fields, type, field } = this.props;
    return (
      <div style={{ marginTop: '2em' }}>
        <p className="input__label">{type} Options</p>
        {(fields[type].fields || []).map((F) => {
          if (!field) return <F.type key={F.name} {...F} name={`options[${F.name}]`} />;
          return <F.type key={F.name} {...F} {...field.options} name={`options[${F.name}]`} />;
        })}
      </div>
    );
  }
}
