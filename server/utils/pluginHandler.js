const events = require('./events');

events.on('pre-new-entry', (entry) => {
  events.emit('new-entry', entry);
});
