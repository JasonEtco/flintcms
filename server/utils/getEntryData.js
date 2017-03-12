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
      author
      fields {
        fieldSlug
        value
      }
    }
  }`;

  const { data: { entry }, errors } = await graphql(schema, query);
  if (errors !== undefined || entry === undefined) throw new Error(404);

  return entry;
};
