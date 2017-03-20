/* eslint-disable no-console */

const { graphql } = require('graphql');
const schema = require('../graphql');

module.exports = async (slug) => {
  const query = `{
    entry (slug: "${slug}", status: "live") {
      _id
      title
      slug
      status
      dateCreated
      section
      template
      author
      fields {
        fieldSlug
        value
      }
    }
  }`;


  const { data: { entry }, errors: entryErrors } = await graphql(schema, query);
  if (entryErrors !== undefined || entry === undefined) {
    console.log(entryErrors);
    throw new Error(404);
  }

  return entry;
};
