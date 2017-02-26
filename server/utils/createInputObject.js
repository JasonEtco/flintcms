const {
  GraphQLScalarType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLID,
} = require('graphql');

function convertInputObjectField(field) {
  let fieldType = field.type;
  const wrappers = [];

  while (fieldType.ofType) {
    wrappers.unshift(fieldType.constructor);
    fieldType = fieldType.ofType;
  }

  if (!(fieldType instanceof GraphQLInputObjectType ||
        fieldType instanceof GraphQLScalarType ||
        fieldType instanceof GraphQLEnumType)) {
    fieldType = fieldType.getInterfaces().includes('NodeInterface')
      ? GraphQLID
      : createInputObject(fieldType);
  }

  fieldType = wrappers.reduce((type, Wrapper) => new Wrapper(type), fieldType);

  return { type: fieldType };
}

function createInputObject(type) {
  const fields = type.getFields();
  return new GraphQLInputObjectType({
    name: `${type.name}Input`,
    fields: Object.keys(fields).map(field => convertInputObjectField(fields[field])),
  });
}

module.exports = createInputObject;
