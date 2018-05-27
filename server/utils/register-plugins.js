const mongoose = require('mongoose')
const { promisify } = require('util')
const fs = require('fs')

const readFileAsync = promisify(fs.readFile)

/**
 * Registers all plugins by looping over the plugin directory,
 * adding new ones to the DB and registering them with Mongoose
 */
function registerPlugins (log) {
  const plugins = global.FLINT.plugins
  const Plugin = mongoose.model('Plugin')

  return Promise.all(plugins.map(async (PluginClass) => {
    if (!PluginClass.uid) throw new Error(`${PluginClass.name} is missing a UID.`)
    if (!PluginClass.version) throw new Error(`${PluginClass.name} is missing a version.`)

    mongoose.plugin((schema, options) => {
      if (schema.name === undefined) return null
      return new PluginClass(schema, options)
    })

    const pathToIcon = PluginClass.icon
    const buffer = await readFileAsync(pathToIcon, null)
    const foundPlugin = await Plugin.findOne({ uid: PluginClass.uid })

    const pluginData = Object.assign({}, {
      title: PluginClass.title,
      name: PluginClass.name,
      uid: PluginClass.uid,
      version: PluginClass.version,
      icon: {
        path: PluginClass.icon,
        buffer
      }
    }, PluginClass.model)

    if (foundPlugin) {
      // Update the existing plugin in case its configuration (icon, name, etc) have changed.
      const updatedPlugin = Object.assign(foundPlugin, pluginData, { uid: PluginClass.uid })
      const savedPlugin = await updatedPlugin.save()
      if (!savedPlugin) log.error(`Could not save the [${PluginClass.name}] plugin to the database.`)
    } else {
      // Create a new plugin instance by including the Class model
      // The PluginSchema has { strict: false } so additions to the
      // model will work fine.
      const newPlugin = new Plugin(pluginData)
      const savedPlugin = await newPlugin.save()
      if (!savedPlugin) log.error(`Could not save the [${PluginClass.name}] plugin to the database.`)
    }
  }))
}

module.exports = registerPlugins
