/**
 * Formats fields by key/value pairs into a larger, more descriptive object
 * @param {Object} fields
 * @param {Object} stateFields
 *
 * @typedef {Object} FieldObject
 * @property {String} fieldId - Mongo ID of the Field
 * @property {String} handle - Slug of the Field's title
 * @property {Any} value - the value for this field in the Page
 *
 * @returns {FieldObject}
 */
async function formatFields(fields, stateFields) {
  if (fields.length <= 0) return fields;

  const options = await Object.keys(fields).map((key) => {
    const fieldId = stateFields.find(field => key === field.handle)._id;
    return {
      fieldId,
      handle: key,
      value: fields[key],
    };
  });
  return options;
}

export default formatFields;
