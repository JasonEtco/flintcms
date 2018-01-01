const testing = process.env.NODE_ENV === 'test';

/* istanbul ignore next */
require('dotenv').config({ path: testing ? '.env.dev' : '.env' });

const path = require('path');
const log = require('debug')('flint');
const chalk = require('chalk');
const { generateEnvFile } = require('./server/utils/generate-env-file');
const nunjuckEnv = require('./server/utils/nunjucks');
const validateEnvVariables = require('./server/utils/validateEnvVariables');
const scaffold = require('./server/utils/scaffold');
const { verifyNodemailer } = require('./server/utils/emails');
const compileSass = require('./server/utils/compile-sass');
const FlintPlugin = require('./server/utils/FlintPlugin');
const connectToDatabase = require('./server/utils/database');
const createServer = require('./server');

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
   *
   * @typedef {Object} Flint
   * @property {String} [templatePath] - Path to your templates directory
   * @property {String} [scssPath] - Path to your scss directory
   * @property {String} [publicPath] - Path to your public directory
   * @property {String} [publicUrl] - Url for your public folder
   * @property {String} [logsPath] - Path to your logs directory
   * @property {String} [scssEntryPoint] - The entry point to your SCSS styles (within the scssPath)
   * @property {String[]} [scssIncludePaths] - Array of paths to include in SCSS compiling
   * @property {String} [siteName] - The title of your site
   * @property {String} [siteUrl] - The URL to your site
   * @property {Boolean} [listen] - Should the server listen; used for testing
   * @property {Boolean} [enableCacheBusting] - Add a hash to the compiled CSS bundle
   * @property {Function[]} [plugins] - Array of required Class modules
   *
   * @param {Flint} settings
   * @param {boolean} debugMode
   */
  constructor(settings = {}, debugMode) {
    const {
      templatePath,
      scssPath,
      publicPath,
      plugins,
      scssEntryPoint,
      scssIncludePaths,
      logsPath,
      publicUrl,
    } = settings;

    const FLINT = Object.assign({}, settings, {
      logsPath: path.resolve(logsPath || 'logs'),
      templatePath: path.resolve(templatePath || 'templates'),
      scssPath: path.resolve(scssPath || 'scss'),
      publicPath: path.resolve(publicPath || 'public'),
      plugins: plugins || [],
      scssEntryPoint: scssEntryPoint !== undefined ? scssEntryPoint : 'main.scss',
      scssIncludePaths: scssIncludePaths || [],
      publicUrl: publicUrl || '/public',
      debugMode,
    });

    global.FLINT = FLINT;

    Promise.all([
      scaffold(FLINT.templatePath),
      scaffold(FLINT.publicPath),
      scaffold(FLINT.logsPath),
    ]);

    if (!FLINT.scssEntryPoint) scaffold(FLINT.scssPath);

    global.FLINT.nun = nunjuckEnv(FLINT.templatePath);

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

    /* istanbul ignore if */
    if (!shouldContinue) {
      log(chalk.red('Could not start the server.'));
      return process.exit(1);
    }

    const connectedToDatabase = await connectToDatabase();
    log(connectedToDatabase);

    const canSendEmails = await verifyNodemailer().catch(log);
    if (canSendEmails) log(canSendEmails);

    const canCompileSass = await compileSass();
    log(canCompileSass);
    /* eslint-enable no-console */

    this.server = createServer(port);

    if (global.FLINT.listen !== false) {
      this.server.listen(port, () => {
        // eslint-disable-next-line no-console
        log(`\n${chalk.green('[HTTP Server]')} Flint server running at http://localhost:${port}\n`);
      });
    }

    return this.server;
  }
};
