/* eslint-disable no-console */

const { graphql } = require('graphql')
const schema = require('../graphql')

/**
 * Query the database for the Entry data
 * @param {Object} entry
 * @param {String} entry.slug
 * @param {String} entry.section
 * @returns {Object|Boolean} Entry object or `false` if there is no Entry
 */
async function getEntryData ({ slug, section }) {
  const query = `query ($slug: String!, $status: String!, $sectionSlug: String!) {
    entry (slug: $slug, status: $status, sectionSlug: $sectionSlug) {
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
  }`

  const variables = {
    slug,
    status: 'live',
    sectionSlug: section
  }

  const { data } = await graphql(schema, query, null, null, variables)

  if (data.entry === undefined || data.entry === null) {
    return false
  }

  return data.entry
}

module.exports = getEntryData
