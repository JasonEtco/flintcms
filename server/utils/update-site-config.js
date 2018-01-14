const mongoose = require('mongoose')

async function updateSiteConfig () {
  const Site = mongoose.model('Site')
  const site = await Site.findOne().exec()
  if (!site) {
    const newSite = new Site(global.FLINT)
    const savedSite = await newSite.save()

    /* istanbul ignore if */
    if (!savedSite) throw new Error('Could not save the site config to the database.')
    return savedSite
  }

  const updatedSite = await Site.findByIdAndUpdate(site._id, global.FLINT, { new: true }).exec()

  /* istanbul ignore if */
  if (!updatedSite) throw new Error('Could not save the site config to the database.')
  return updatedSite
}

module.exports = updateSiteConfig
