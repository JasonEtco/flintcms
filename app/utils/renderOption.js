import React from 'react';
import Fields from 'components/Fields';

/**
 * Returns a React component of the relevant Field
 * @param {String} field - The name of the Field
 * @param {Any} [value]
 */
export default function renderOption(field, value) {
  const fieldType = Fields[field.type];

  const props = {
    key: field._id,
    name: field.handle,
    label: field.title,
    instructions: field.instructions,
    defaultValue: value || (field.options ? field.options.defaultValue : ''),
    ...field.options,
    ...fieldType.props,
  };

  const Component = fieldType.component;

  return <Component {...props} />;
}
