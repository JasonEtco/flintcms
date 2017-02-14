const Handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

const partialsDir = path.join(__dirname, '..', '..', 'templates', '_partials');

const filenames = fs.readdirSync(partialsDir);

filenames.forEach((filename) => {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(`${partialsDir}/${filename}`, 'utf8');
  Handlebars.registerPartial(name, template);
});
