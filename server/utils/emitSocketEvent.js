module.exports = function emitSocketEvent({ io, req }, event, payload) {
  const socket = io.sockets.connected[req.body.socket];
  if (socket) socket.broadcast.emit(event, payload);
};
