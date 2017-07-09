/* eslint-disable no-console */

const { graphql } = require('graphql');
const schema = require('../graphql');

/**
 * Query the database for the Entry data
 * @param {Object} entry
 * @param {String} entry.slug
 * @param {String} entry.section
 * @returns {Object|Boolean} Entry object or `false` if there is no Entry
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

  const { data } = await graphql(schema, query);
  if (data.entry === undefined || data.entry === null) {
    return false;
  }

  return data.entry;
}

module.exports = getEntryData;
