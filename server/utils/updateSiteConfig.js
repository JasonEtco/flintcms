const mongoose = require('mongoose');

const Site = mongoose.model('Site');

async function updateSiteConfig() {
  const site = await Site.findOne().exec();
  if (!site) {
    const newSite = new Site(global.FLINT);
    const savedSite = await newSite.save();

    if (!savedSite) throw new Error('Could not save the site config to the database.');
  } else {
    Site.update({ _id: site._id }, global.FLINT, (err) => {
      if (err) throw new Error(err);
    });
  }
}

module.exports = updateSiteConfig;
