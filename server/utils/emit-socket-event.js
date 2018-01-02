/**
 * Broadcasts a socket event
 * @param {Object} param0
 * @param {Object} param0.io
 * @param {Object} param0.req
 * @param {String} event
 * @param {Any} payload
 */
function emitSocketEvent({ io, req }, event, payload) {
  const socket = io.sockets.connected[req.body.socket];
  if (socket) socket.broadcast.emit(event, payload);
}

module.exports = emitSocketEvent;
