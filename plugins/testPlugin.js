const events = require('../server/utils/events');

events.on('new-entry', (entry) => {
  entry.title = 'Pizzzzzzza';
});

events.on('update-entry', (entry) => {
  entry.title = `updated-${entry.title}`;
  entry.save();
});

events.on('new-user', (user) => {
  if (user.email.includes('gmail')) throw new Error('No Gmail allowed!');
});
