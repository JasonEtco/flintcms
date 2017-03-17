const entries = require('./entries');
const fields = require('./fields');
const sections = require('./sections');
const assets = require('./assets');
const users = require('./users');
const usergroups = require('./usergroups');

module.exports = Object.assign({}, entries, fields, sections, assets, users, usergroups);
