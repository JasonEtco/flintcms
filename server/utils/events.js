const EventEmitter = require('events');

class FlintEmitter extends EventEmitter {
  /**
   * Emits an event with an object and returns that object.
   * @param {String} event - Event name
   * @param {object} obj
   * @returns {object}
   */
  emitObject(event, obj = {}) {
    this.emit(event, obj);
    return obj;
  }
}

const flintEmitter = new FlintEmitter();

module.exports = flintEmitter;
