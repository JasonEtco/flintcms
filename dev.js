const Flint = require('.').Flint;

const flintServer = new Flint({
  scssEntryPoint: false,
}, true);

flintServer.startServer();
