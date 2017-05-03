const { graphql } = require('graphql');
const schema = require('../graphql');
const h = require('./helpers');

/**
 * Adds organized key/value field pairs onto entries
 * @param {Object[]} entries - Array of Entry objects
 * @returns {Object[]}
 */
async function formatEntryFields(entries) {
  return entries.map(entry => Object.assign({}, entry, h.reduceToObj(entry.fields, 'handle', 'value')));
}


/**
 * Organizes entries by section slug
 * @param {Object[]} dataSections - Array of Section objects
 * @param {Object[]} entries - Array of formatted entries
 *
 * @typedef {Object} Section
 * @property {String} title - Title of the section
 * @property {String} slug - Slug of the section
 * @property {Object[]} entries - Array of Entries
 *
 * @returns {Section}
 */
async function sectionEntries(dataSections, entries) {
  // Organizes sections by _id/slug
  const sections = await h.reduceToObj(dataSections, '_id', 'slug');

  // Get just the _ids from the new sections object
  const sectionKeys = Object.keys(sections);

  const sectionedEntries = await sectionKeys.reduce((prev, curr) => {
    const filtered = entries.filter(entry => entry.section === curr);
    const secDetails = dataSections.find(sec => sec._id === curr);

    return Object.assign({}, prev, {
      [sections[curr]]: Object.assign({}, secDetails, { entries: filtered }),
    });
  }, {});

  return sectionedEntries;
}


/**
 * Collects all of the entries, sections, users and fields
 * and prepares them for us in a template
 * @param {Object} entryData
 * @returns {Object} An object containg the specific entry data and all the other collected data
 */
async function collectData(entry) {
  const query = `{
    entries (status: "live") {
      _id
      title
      slug
      section
      url
      fields {
        handle
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
    site {
      style
    }
  }`;

  const { data } = await graphql(schema, query);
  const formattedEntries = await formatEntryFields(data.entries);
  const sections = await sectionEntries(data.sections, formattedEntries);
  const flint = Object.assign({}, data, {
    sections,
    section(section) {
      return this.sections[section];
    },
  });

  if (entry) {
    return {
      entry: Object.assign({}, entry, h.reduceToObj(entry.fields, 'handle', 'value')),
      flint,
    };
  }

  return { flint };
}

module.exports = collectData;
