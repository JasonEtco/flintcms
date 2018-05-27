const { GraphQLScalarType } = require('graphql/type')
const { GraphQLError } = require('graphql/error')
const { Kind } = require('graphql/language')

const ObjectType = new GraphQLScalarType({
  name: 'ObjectType',
  serialize: value => value,
  parseValue: value => value,
  parseLiteral: (ast) => {
    /* istanbul ignore if */
    if (ast.kind !== Kind.OBJECT) {
      throw new GraphQLError(`Query error: Can only parse object but got a: ${ast.kind}, ${[ast]}`)
    }
    return ast.value
  }
})

module.exports = ObjectType
