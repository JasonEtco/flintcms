const mongoose = require('mongoose')
const express = require('express')
const getLatestVersion = require('latest-version')
const semverDiff = require('semver-diff')
const pkg = require('../../../package.json')

const router = express.Router()
const Site = mongoose.model('Site')

module.exports = () => {
  router.get('/site', (req, res) => {
    Site.findOne().select('siteLogo')
      .then(site => res.status(200).json(site))
  })

  router.get('/hasUpdate', async (req, res) => {
    const currentVersion = pkg.version
    const latestVersion = await getLatestVersion(pkg.name)

    res.json({ hasUpdate: semverDiff(currentVersion, latestVersion) !== null })
  })

  return router
}
