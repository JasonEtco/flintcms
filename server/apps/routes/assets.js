const path = require('path')
const express = require('express')
const multer = require('multer')
const jimp = require('jimp')
const { graphql } = require('graphql')
const schema = require('../../graphql')
const scaffold = require('../../utils/scaffold')

const router = express.Router()

async function saveFile (buffer, pathToFile) {
  const jimpFile = await jimp.read(buffer)
  const { width, height } = jimpFile.bitmap
  const writtenFile = await jimpFile.write(pathToFile)

  /* istanbul ignore if */
  if (!writtenFile) throw new Error('There was an erroring saving your file.')

  return { width, height }
}

async function processReq (req) {
  const { body, file } = req
  const { originalname, buffer, size, mimetype } = file
  const pathToFile = path.join(global.FLINT.publicPath, 'assets', originalname)
  const { width, height } = await saveFile(buffer, pathToFile)

  return {
    data: {
      title: body.title,
      filename: originalname,
      size,
      width,
      height,
      mimetype
    }
  }
}

module.exports = (app) => {
  const io = app.get('io')

  // Multer provides multipart form data parsing.
  const storage = multer.memoryStorage()
  const upload = multer({ storage })

  router.post('/assets', upload.single('file'), async (req, res) => {
    process.nextTick(async () => {
      scaffold(path.join(global.FLINT.publicPath, 'assets'))
      const vars = await processReq(req)

      const query = `mutation ($data: AssetInput!) {
        addAsset(data: $data) {
         _id
         title
         filename
         size
         mimetype
         width
         height
         extension
       }
      }`

      const { errors, data } = await graphql(schema, query, { io }, null, vars)

      /* istanbul ignore next */
      if (errors !== undefined && errors.length > 0) {
        res.status(500).json(errors)
      } else {
        res.status(200).json(data)
      }
    })
  })

  router.put('/assets/:_id', upload.single('file'), async (req, res) => {
    process.nextTick(async () => {
      scaffold(path.join(global.FLINT.publicPath, 'assets'))
      const processedVars = await processReq(req)

      const query = `mutation ($data: AssetInput!, $_id: ID!) {
        updateAsset(data: $data, _id: $_id) {
         _id
         title
         filename
         size
         mimetype
         width
         height
         extension
       }
      }`

      const vars = {
        _id: req.params._id,
        data: processedVars.data
      }

      const { errors, data } = await graphql(schema, query, { io }, null, vars)
      if (errors !== undefined && errors.length > 0) {
        res.status(500).json(errors)
      } else {
        res.status(200).json(data)
      }
    })
  })

  return router
}
