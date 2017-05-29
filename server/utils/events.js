const EventEmitter = require('events');

class FlintEmitter extends EventEmitter {}

const flintEmitter = new FlintEmitter();

module.exports = flintEmitter;
