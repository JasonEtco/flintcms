const express = require('express')
const path = require('path')

const appDir = path.join(__dirname, '..', '..', 'app')

module.exports = (app, logger) => {
  const admin = express()
  admin.use('/static', express.static(path.join(appDir, 'dist')))
  admin.get('*', async (req, res) => {
    res.sendFile(path.join(appDir, 'index.html'))
  })

  return admin
}
