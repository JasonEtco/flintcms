/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fields from 'components/Fields';

export default class FieldOptions extends Component {
  static propTypes = {
    fields: PropTypes.object,
    field: PropTypes.object,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    fields: Fields,
    field: null,
    onChange: null,
  }

  render() {
    const { fields, type, field, onChange } = this.props;
    const optionFields = fields[type].fields;

    if (!optionFields) return null;

    return (
      <div style={{ marginTop: '2em' }}>
        <p className="input__label form-element">{type} Options</p>
        {(optionFields).map((F) => {
          if (!field) return <F.component onChange={onChange} key={F.name} {...F} name={`options[${F.name}]`} />;
          return <F.component onChange={onChange} key={F.name} {...F} {...field.options} name={`options[${F.name}]`} />;
        })}
      </div>
    );
  }
}
