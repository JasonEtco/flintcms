const { graphql } = require('graphql');
const schema = require('../graphql');

module.exports = async function collectData(data) {
  const query = `{
      entries {
        _id
        title
        slug
        section
      }
      sections {
        _id
        title
        slug
      }
      users {
        _id
        username
      }
      fields {
        _id
        title
        instructions
        type
        dateCreated
        slug
      }
    }`;

  const ql = await graphql(schema, query);
  const bigData = await Object.assign({}, { entry: data }, { flint: ql.data });

  return bigData;
};
