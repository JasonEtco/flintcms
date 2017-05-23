const mongoose = require('mongoose');
const path = require('path');
const { readdirAsync, readFileAsync } = require('./fsPromises');

const pathToPlugins = path.join(__dirname, '..', '..', 'plugins');
const Plugin = mongoose.model('Plugin');

/**
 * Registers all plugins by looping over the plugin directory,
 * adding new ones to the DB and registering them with Mongoose
 */
async function registerPlugins() {
  const pluginFolders = await readdirAsync(pathToPlugins);

  pluginFolders.forEach(async (plugin) => {
    const Class = require(path.join(pathToPlugins, plugin)); // eslint-disable-line

    // Check if the plugin already exists in the database
    if (!await Plugin.findOne({ name: Class.name })) {
      const buffer = await readFileAsync(path.resolve(pathToPlugins, plugin, Class.icon), null);

      // Create a new plugin instance by including the Class model
      // The PluginSchema has { strict: false } so additions to the
      // model will work fine.
      const newPlugin = new Plugin(Object.assign({}, {
        name: Class.name,
        icon: {
          path: Class.icon,
          buffer,
        },
      }, Class.model));

      const savedPlugin = await newPlugin.save();
      if (!savedPlugin) throw new Error(`Could not save the [${Class.name()}] plugin to the database.`);

      // eslint-disable-next-line no-console
      console.log(`[Plugin] Registering the [${Class.name}] plugin`);
    }

    mongoose.plugin(schema => new Class(schema));
  });
}

module.exports = registerPlugins;
