import React from 'react';
import Fields from '../components/Fields';

export default function renderOption(field) {
  switch (field.type) {
    case 'Dropdown':
      return (
        <Fields.Dropdown
          key={field._id}
          name={field.slug}
          label={field.title}
          instructions={field.instructions}
          options={field.options}
        />
      );
    case 'Text':
      return (
        <Fields.Text
          key={field._id}
          name={field.slug}
          label={field.title}
          instructions={field.instructions}
        />
      );
    case 'Color':
      return (
        <Fields.Color
          key={field._id}
          name={field.slug}
          label={field.title}
          instructions={field.instructions}
        />
      );

    default:
      return false;
  }
}
