const testing = process.env.NODE_ENV === 'test';
require('dotenv').config({ path: testing ? '.env.dev' : '.env' });

const path = require('path');
const chalk = require('chalk');
const generateEnvFile = require('./server/utils/generateEnvFile');
const validateEnvVariables = require('./server/utils/validateEnvVariables');
const scaffold = require('./server/utils/scaffold');
const { verifyNodemailer } = require('./server/utils/emails');
const compileSass = require('./server/utils/compileSass');
const FlintPlugin = require('./server/utils/FlintPlugin');
const connectToDatabase = require('./server/utils/database');
const createServer = require('./server');

/**
 * @typedef {Object} FLINT
 * @property {String} templatePath - Path to your templates directory
 * @property {String} scssPath - Path to your scss directory
 * @property {String} publicPath - Path to your public directory
 * @property {String} logsPath - Path to your logs directory
 * @property {String} scssEntryPoint - The entry point to your SCSS styles (within the scssPath)
 * @property {String[]} scssIncludePaths - Array of paths to include in SCSS compiling
 * @property {String} siteName - The title of your site
 * @property {String} siteUrl - The URL to your site
 * @property {Boolean} [listen] - Should the server listen; used for testing
 * @property {Function[]} plugins - Array of required Class modules
 */

/**
 * Flint class
 * @class
 */
module.exports = class Flint {
  static get FlintPlugin() {
    return FlintPlugin;
  }

  /**
   * Create a Flint server
   * @param {FLINT} settings
   * @param {boolean} debugMode
   */
  constructor(settings = {}, debugMode) {
    const appDir = path.dirname(require.main.filename);
    const {
      templatePath,
      scssPath,
      publicPath,
      plugins,
      scssEntryPoint,
      scssIncludePaths,
    } = settings;

    const FLINT = Object.assign({}, settings, {
      logsPath: path.join(appDir, 'logs'),
      templatePath: path.join(appDir, templatePath || 'templates'),
      scssPath: path.join(appDir, scssPath || 'scss'),
      publicPath: path.join(appDir, publicPath || 'public'),
      plugins: plugins || [],
      scssEntryPoint: scssEntryPoint !== undefined ? scssEntryPoint : 'main.scss',
      scssIncludePaths: scssIncludePaths || [],
      debugMode,
      appDir,
    });

    global.FLINT = FLINT;

    scaffold(FLINT.logsPath);
    scaffold(FLINT.templatePath);
    if (!FLINT.scssEntryPoint) scaffold(FLINT.scssPath);
    scaffold(FLINT.publicPath);

    this.port = process.env.PORT || 4000;
  }

  /**
   * Checks configuration for important credentials
   * then starts the Flint server
   * @param {Number} [port] - Defaults to either the process.env port or 4000
   */
  async startServer(port = this.port) {
    /* eslint-disable no-console */
    const missingEnvVariables = validateEnvVariables();
    const didGenerateEnv = await generateEnvFile();
    if (didGenerateEnv && !testing) return process.exit();

    const shouldContinue = missingEnvVariables.length === 0;
    if (!shouldContinue) {
      if (!testing) console.error(chalk.red('Could not start the server.'));
      return process.exit(1);
    }

    const connectedToDatabase = await connectToDatabase();
    if (!testing) console.log(connectedToDatabase);

    if (!testing) {
      const canSendEmails = await verifyNodemailer().catch(console.error);
      if (canSendEmails) {
        console.log(canSendEmails);
      }
    }

    const canCompileSass = await compileSass();
    if (!testing) console.log(canCompileSass);
    /* eslint-enable no-console */

    this.server = createServer(port);

    if (global.FLINT.listen !== false) {
      this.server.listen(port, () => {
        // eslint-disable-next-line no-console
        if (!testing) console.log(`\n${chalk.green('[HTTP Server]')} Flint server running at http://localhost:${port}\n`);
      });
    }

    return this.server;
  }

  closeServer(cb) {
    return this.server.shutdown(cb);
  }
};
