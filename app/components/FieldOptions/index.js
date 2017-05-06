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
    const optionFields = fields[type].fields;

    if (!optionFields) return null;

    return (
      <div style={{ marginTop: '2em' }}>
        <p className="input__label form-element">{type} Options</p>
        {(optionFields).map((F) => {
          if (!field) return <F.component key={F.name} {...F} name={`options[${F.name}]`} />;
          return <F.component key={F.name} {...F} {...field.options} name={`options[${F.name}]`} />;
        })}
      </div>
    );
  }
}
