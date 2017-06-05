const sass = require('node-sass');
const path = require('path');
const { Inky } = require('inky');
const juice = require('juice');
const cheerio = require('cheerio');
const nunjucks = require('nunjucks');

const pathToTemplates = path.resolve(__dirname, 'templates');
const nun = nunjucks.configure(pathToTemplates, {
  noCache: process.env.NODE_ENV !== 'production',
});

function renderSass(file) {
  return new Promise((res, rej) => {
    sass.render({ file }, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}

/**
 * Compile an email template using Nunjucks/Inky
 * @param {String} template - Template's file name, minus the extension
 * @param {Object} data - Data object to compile with
 * @returns {String}
 */
async function compile(template, data) {
  const templatePath = path.join(pathToTemplates, `${template}.html`);

  const nunCompiled = await nun.render(templatePath, data);

  const inky = new Inky({});
  const cheerioString = await cheerio.load(nunCompiled);
  const html = await inky.releaseTheKraken(cheerioString);

  const pathToSCSS = path.join(pathToTemplates, 'styles', 'emails.scss');
  const { css } = await renderSass(pathToSCSS);

  const ret = await html.replace('<!-- <style> -->', `<style>${css.toString('utf-8')}</style>`);
  const juiced = await juice(ret);
  return juiced;
}

module.exports = compile;
