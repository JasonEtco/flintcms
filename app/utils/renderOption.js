import React from 'react';
import Fields from '../components/Fields';

/**
 * Returns a React component of the relevant Field
 * @param {String} field - The name of the Field
 * @param {Any} [value]
 */
export default function renderOption(field, value) {
  switch (field.type) {
    case 'Dropdown':
      return (
        <Fields.Dropdown
          key={field._id}
          name={field.slug}
          label={field.title}
          instructions={field.instructions}
          options={field.options}
          defaultValue={value}
        />
      );
    case 'Text':
      return (
        <Fields.Text
          key={field._id}
          name={field.slug}
          label={field.title}
          instructions={field.instructions}
          defaultValue={value}
        />
      );
    case 'Color':
      return (
        <Fields.Color
          key={field._id}
          name={field.slug}
          label={field.title}
          instructions={field.instructions}
          defaultValue={value}
        />
      );
    case 'RichText':
      return (
        <Fields.RichText
          key={field._id}
          name={field.slug}
          label={field.title}
          instructions={field.instructions}
          defaultValue={value}
        />
      );

    default:
      return false;
  }
}
