const mongoose = require('mongoose');
const chalk = require('chalk');
const { readFileAsync } = require('./fsPromises');

const Plugin = mongoose.model('Plugin');

/**
 * Registers all plugins by looping over the plugin directory,
 * adding new ones to the DB and registering them with Mongoose
 */
function registerPlugins() {
  const plugins = global.FLINT.plugins;

  plugins.forEach(async (PluginClass) => {
    if (!PluginClass.uid) throw new Error(`${PluginClass.name}`);

    mongoose.plugin((schema) => {
      if (schema.name === undefined) return null;
      // eslint-disable-next-line no-console
      console.log(`${chalk.grey('[Plugin]')} Registered the ${chalk.bold(`[${PluginClass.name}]`)} plugin against the ${schema.name} Model.`);
      return new PluginClass(schema, PluginClass);
    });

    const pathToIcon = PluginClass.icon;
    const buffer = await readFileAsync(pathToIcon, null);
    const foundPlugin = await Plugin.findOne({ uid: PluginClass.uid });

    const pluginData = Object.assign({}, {
      name: PluginClass.name,
      uid: PluginClass.uid,
      icon: {
        path: PluginClass.icon,
        buffer,
      },
    }, PluginClass.model);

    if (foundPlugin) {
      // Update the existing plugin in case its configuration (icon, name, etc) have changed.
      const updatedPlugin = Object.assign(foundPlugin, pluginData, { uid: PluginClass.uid });
      const savedPlugin = await updatedPlugin.save();
      if (!savedPlugin) throw new Error(`Could not save the [${PluginClass.name}] plugin to the database.`);
    } else {
      // Create a new plugin instance by including the Class model
      // The PluginSchema has { strict: false } so additions to the
      // model will work fine.
      const newPlugin = new Plugin(pluginData);
      const savedPlugin = await newPlugin.save();
      if (!savedPlugin) throw new Error(`Could not save the [${PluginClass.name}] plugin to the database.`);
    }
  });
}

module.exports = registerPlugins;
