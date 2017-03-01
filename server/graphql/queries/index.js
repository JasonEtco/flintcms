const entries = require('./entries');
const sections = require('./sections');
const users = require('./users');
const fields = require('./fields');
const assets = require('./assets');

module.exports = Object.assign({}, entries, sections, users, fields, assets);
