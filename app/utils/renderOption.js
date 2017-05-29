import React from 'react';
import Fields from 'components/Fields';

/**
 * Returns a React component of the relevant Field
 * @param {Object} field - The field object
 * @param {Any} [value]
 * @param {Object} betterProps - Props to overwrite with
 */
export default function renderOption(field, value, betterProps) {
  const fieldType = Fields[field.type];

  const props = {
    key: field._id,
    name: field.handle,
    label: field.title,
    instructions: field.instructions,
    defaultValue: value || (field.options ? field.options.defaultValue : ''),
    ...field.options,
    ...fieldType.props,
    ...betterProps,
  };

  const Component = fieldType.component;

  return <Component {...props} />;
}
