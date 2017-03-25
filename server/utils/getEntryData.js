/* eslint-disable no-console */

const { graphql } = require('graphql');
const schema = require('../graphql');

/**
 * Query the database for the Entry data
 * @param {Object} entry
 * @param {String} entry.slug
 * @param {String} entry.section
 * @returns {Object} Entry object
 */
async function getEntryData({ slug, section }) {
  const query = `{
    entry (slug: "${slug}", status: "live", section: "${section}") {
      _id
      title
      slug
      status
      dateCreated
      section
      template
      author
      fields {
        handle
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
}

module.exports = getEntryData;
