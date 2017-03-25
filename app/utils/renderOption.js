import React from 'react';
import Fields from '../components/Fields';

/**
 * Returns a React component of the relevant Field
 * @param {String} field - The name of the Field
 * @param {Any} [value]
 */
export default function renderOption(field, value) {
  const props = {
    key: field._id,
    name: field.handle,
    label: field.title,
    instructions: field.instructions,
    defaultValue: value,
  };

  switch (field.type) {
    case 'Dropdown':
      return <Fields.Dropdown {...props} options={field.options} />;
    case 'Text':
      return <Fields.Text {...props} />;
    case 'Color':
      return <Fields.Color {...props} />;
    case 'RichText':
      return <Fields.RichText {...props} />;
    case 'Asset':
      return <Fields.Asset {...props} />;

    default:
      return null;
  }
}
