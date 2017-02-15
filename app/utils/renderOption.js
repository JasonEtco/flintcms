import React from 'react';
import Fields from '../components/Fields';

export default function renderOption(field) {
  const Field = Fields[field.type];
  return <Field key={field._id} {...field} />;
}
