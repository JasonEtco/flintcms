const entries = require('./entries');
const fields = require('./fields');
const sections = require('./sections');
const assets = require('./assets');

module.exports = Object.assign({}, entries, fields, sections, assets);
