import React from 'react';
import Fields from '../components/Fields';

/**
 * Returns a React component of the relevant Field
 * @param {String} field - The name of the Field
 * @param {Any} [value]
 */
export default function renderOption(field, value) {
  const props = {
    ...field,
    key: field._id,
    name: field.handle,
    label: field.title,
    instructions: field.instructions,
    defaultValue: value,
  };

  const Component = Fields[field.type].component;

  return <Component {...props} />;
}
