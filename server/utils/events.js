const EventEmitter = require('events')

EventEmitter.defaultMaxListeners = 40

class FlintEmitter extends EventEmitter {}

const flintEmitter = new FlintEmitter()

module.exports = flintEmitter
