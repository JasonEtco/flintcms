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

  const sectionQuery = `{
    section (_id: "${entry.section}") {
      template
    }
  }`;

  const { data: { section }, errors: sectionErrors } = await graphql(schema, sectionQuery);

  if (sectionErrors !== undefined || section === undefined) {
    console.log(sectionErrors);
    throw new Error(404);
  }

  return { data: entry, template: section.template };
};
