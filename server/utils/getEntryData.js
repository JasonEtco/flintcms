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
    entry (slug: "${slug}", status: "live", sectionSlug: "${section}") {
      _id
      title
      slug
      status
      dateCreated
      section
      template
      author {
        name {
          first
          last
        }
        username
        email
      }
      fields {
        handle
        value
      }
    }
  }`;

  const { data, errors } = await graphql(schema, query);

  if (errors !== undefined && (data.entry === undefined || data.entry === null)) {
    console.error(data, errors);
    throw new Error(404);
  }

  return data.entry;
}

module.exports = getEntryData;
