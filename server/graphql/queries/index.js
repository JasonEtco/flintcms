const entries = require('./entries');
const sections = require('./sections');
const users = require('./users');
const fields = require('./fields');
const assets = require('./assets');
const usergroups = require('./usergroups');

module.exports = Object.assign({}, entries, sections, users, fields, assets, usergroups);
