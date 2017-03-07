const Handlebars = require('handlebars');
const layouts = require('handlebars-layouts');

Handlebars.registerHelper(layouts(Handlebars));

Handlebars.registerHelper('debug', (optionalValue) => {
  /* eslint-disable no-console */
  console.log('Current Context');
  console.log('====================');
  console.log(this);

  if (optionalValue) {
    console.log('Value');
    console.log('====================');
    console.log(optionalValue);
  }
  /* eslint-enable no-console */
});

Handlebars.registerHelper('json', context => JSON.stringify(context, null, 2));
