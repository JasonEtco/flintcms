const { graphql } = require('graphql');
const schema = require('../graphql');
const h = require('./helpers');

/**
 * Collects all of the entries, sections, users and fields
 * and prepares them for us in a template
 * @param {Object} entryData
 * @returns {Object} An object containg the specific entry data and all the other collected data
 */
async function collectData(entryData) {
  const query = `{
    entries (status: "live") {
      _id
      title
      slug
      section
      fields {
        fieldSlug
        value
      }
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

  const { data } = await graphql(schema, query);
  const newEntries = await data.entries.map(entry => Object.assign({}, entry, h.reduceToObj(entry.fields, 'fieldSlug', 'value')));
  const formatted = await Object.assign({}, data, { entries: newEntries });
  const bigData = await Object.assign({}, { entry: entryData }, { flint: formatted });

  return bigData;
}

module.exports = collectData;
