// const fs = require('fs');
const path = require('path');
const { Inky } = require('inky');
const juice = require('juice');
const cheerio = require('cheerio');
const nunjucks = require('nunjucks');

const nun = nunjucks.configure(path.resolve(__dirname, 'templates'), {
  noCache: process.env.NODE_ENV !== 'production',
});

/**
 * Compile an email template using Nunjucks/Inky
 * @param {String} template - Template's file name, minus the extension
 * @param {Object} data - Data object to compile with
 * @returns {String}
 */
async function compile(template, data) {
  const templatePath = path.join(__dirname, 'templates', `${template}.html`);
  const nunCompiled = await nun.render(templatePath, data);
  const inky = new Inky({});
  const html = await cheerio.load(nunCompiled);
  return inky.releaseTheKraken(html);
}

module.exports = compile;
