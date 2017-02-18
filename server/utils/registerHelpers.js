const Handlebars = require('handlebars');

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
