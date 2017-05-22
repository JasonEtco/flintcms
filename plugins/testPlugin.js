const events = require('../server/utils/events');

events.on('new-entry', (entry) => {
  console.log('New Entry!');
  entry.title = 'Pizzzzzzza';

  // Do stuff
  entry.save();
});
