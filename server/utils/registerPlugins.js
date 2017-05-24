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

  pluginFolders.forEach(async (directoryName) => {
    const Class = require(path.join(pathToPlugins, directoryName)); // eslint-disable-line

    const pathToIcon = path.resolve(pathToPlugins, directoryName, Class.icon);
    const buffer = await readFileAsync(pathToIcon, null);

    const foundPlugin = await Plugin.findOne({ directoryName });

    const pluginData = Object.assign({}, {
      name: Class.name,
      directoryName,
      icon: {
        path: Class.icon,
        buffer,
      },
    }, Class.model);

    if (foundPlugin) {
      // Update the existing plugin in case its configuration (icon, name, etc) have changed.
      const updatedPlugin = Object.assign(foundPlugin, pluginData, { directoryName });
      const savedPlugin = await updatedPlugin.save();
      if (!savedPlugin) throw new Error(`Could not save the [${Class.name()}] plugin to the database.`);
    } else {
      // Create a new plugin instance by including the Class model
      // The PluginSchema has { strict: false } so additions to the
      // model will work fine.
      const newPlugin = new Plugin(pluginData);
      const savedPlugin = await newPlugin.save();
      if (!savedPlugin) throw new Error(`Could not save the [${Class.name()}] plugin to the database.`);
    }

    // eslint-disable-next-line no-console
    console.log(`[Plugin] Registering the [${Class.name}] plugin`);
    mongoose.plugin(schema => new Class(schema));
  });
}

module.exports = registerPlugins;
