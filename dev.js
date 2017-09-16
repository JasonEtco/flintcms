const Flint = require('.');

const flintServer = new Flint({
  enableCacheBusting: true,
}, true);

flintServer.startServer();
