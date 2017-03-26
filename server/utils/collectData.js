const { graphql } = require('graphql');
const schema = require('../graphql');
const h = require('./helpers');

/**
 * Reduces an array of objects to one object using the key value pair parameters
 * @param {Array} arr
 * @param {String} key
 * @param {String} value
 * @param {Object} start
 * @returns {Object}
 */
function reducer(arr, key, value, start = {}) {
  return arr
    .reduce((prev, curr) => {
      try {
        const obj = { [curr[key]]: JSON.parse(curr[value]) };
        return Object.assign({}, prev, obj);
      } catch (e) {
        const obj = { [curr[key]]: curr[value] };
        return Object.assign({}, prev, obj);
      }
    }, start);
}

/**
 * Adds organized key/value field pairs onto entries
 * @param {Object[]} entries - Array of Entry objects
 * @returns {Object[]}
 */
async function formatEntryFields(entries) {
  return entries.map(entry => Object.assign({}, entry, reducer(entry.fields, 'handle', 'value')));
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

  return {
    entry: Object.assign({}, entry, reducer(entry.fields, 'handle', 'value')),
    flint,
  };
}

module.exports = collectData;
