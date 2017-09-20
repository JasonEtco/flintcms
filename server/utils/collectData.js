const { graphql } = require('graphql');
const schema = require('../graphql');
const h = require('./helpers');
const perms = require('../utils/permissions.json');

/**
 * Adds organized key/value field pairs onto entries
 * @param {Object[]} entries - Array of Entry objects
 * @returns {Object[]}
 */
async function formatEntryFields(arr, target = 'fields') {
  return arr.map(doc => Object.assign({}, doc, h.reduceToObj(doc[target], 'handle', 'value')));
}

/**
 * Adds the next/previous properties to an entry
 * @param {Object} entry - An entry object
 * @param {Object[]} entries - Array of Entry objects
 * @returns {Object}
 */
function addNextPrevious(entry, entries, target = 'fields') {
  const i = entries.findIndex(e => e._id === entry._id);
  return Object.assign({}, entry, h.reduceToObj(entry[target], 'handle', 'value'), {
    previous: entries[i - 1] ? entries[i - 1] : null,
    next: entries[i + 1] ? entries[i + 1] : null,
  });
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
  const sections = await h.reduceToObj(dataSections, '_id', 'handle');

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


const permissions = `
  permissions {
    ${Object.keys(perms).map(key => `${key} {\n${perms[key].map(({ name }) => `\t${name}`).join('\n')}\n}`).join('\n')}
  }
`;

/**
 * Collects all of the entries, sections, users and fields
 * and prepares them for us in a template
 * @param {Object} entryData
 * @returns {Object} An object containg the specific entry data and all the other collected data
 */
async function collectData(entry) {
  const query = `{
    assets {
      _id
      title
      filename
      size
      width
      height
      dateCreated
    }

    entries (status: "live") {
      _id
      title
      slug
      section
      url
      dateCreated
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

    sections {
      _id
      title
      slug
      handle
      template
      fields
      dateCreated
    }

    pages {
      _id
      title
      slug
      handle
      template
      fields {
        handle
        fieldId
        value
      }
      fieldLayout
      dateCreated
      homepage
      route
    }

    users {
      _id
      username
      dateCreated
      email
      name {
        first
        last
      }
      usergroup {
        _id
        title
        slug
        dateCreated
        ${permissions}
      }
    }

    usergroups {
      _id
      title
      slug
      dateCreated
      ${permissions}
    }

    fields {
      _id
      type
      title
      slug
      handle
      required
      options
      dateCreated
    }

    site {
      siteName
      siteUrl
      style
    }
  }`;

  const { data, errors } = await graphql(schema, query);
  if (errors) throw new Error(errors);

  const [formattedEntries, formattedPages] = await Promise.all([
    formatEntryFields(data.entries),
    formatEntryFields(data.pages),
  ]);

  const sections = await sectionEntries(data.sections, formattedEntries);
  const flint = Object.assign({}, data, {
    pages: formattedPages,
    page(page) {
      return this.pages.find(p => p.handle === page);
    },
    section(section) {
      return sections[section];
    },
  });

  if (entry) {
    return {
      this: addNextPrevious(entry, formattedEntries),
      flint,
    };
  }

  return { flint };
}

module.exports = collectData;
