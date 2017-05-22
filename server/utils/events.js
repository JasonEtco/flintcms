const EventEmitter = require('events');

class GlobalEmitter extends EventEmitter {}
const FlintEmitter = new GlobalEmitter();

module.exports = FlintEmitter;
