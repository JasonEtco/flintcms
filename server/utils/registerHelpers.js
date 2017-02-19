const Handlebars = require('handlebars');
const layouts = require('handlebars-layouts');

Handlebars.registerHelper(layouts(Handlebars));

Handlebars.registerHelper('debug', (optionalValue) => {
  console.log('Current Context');
  console.log('====================');
  console.log(this);

  if (optionalValue) {
    console.log('Value');
    console.log('====================');
    console.log(optionalValue);
  }
});

Handlebars.registerHelper('json', context => JSON.stringify(context, null, 2));
