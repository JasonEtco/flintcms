const mongoose = require('mongoose');
const express = require('express');
const compile = require('./compile');
const fourOhFourHandler = require('./fourOhFourHandler');
const getEntryData = require('./getEntryData');

const Page = mongoose.model('Page');
const router = express.Router();

function handleCompileErrorRoutes(req, res, compiled, template) {
  switch (compiled) {
    case 'no-html':
    case 'no-template':
      res.redirect(`/admin/error?r=${compiled}&t=${template}&p=${req.originalUrl}`);
      break;
    case 'no-exist':
      fourOhFourHandler(res);
      break;
    default:
      res.send(compiled);
  }
}

router.get('/', async (req, res) => {
  const homepage = await Page.findOne({ homepage: true }).lean().exec();
  const compiled = await compile(homepage.template, homepage);
  res.send(compiled);
});

router.get('*', async (req, res, next) => {
  if (req.originalUrl.startsWith('/admin')) next();
  const page = await Page.findOne({ route: req.originalUrl }).lean().exec();
  if (!page) return next();

  const compiled = await compile(page.template, page);
  return handleCompileErrorRoutes(req, res, compiled, page.template);
});

router.get('/:section/:slug', async (req, res) => {
  const entry = await getEntryData(req.params);

  if (!entry) return handleCompileErrorRoutes(req, res, 'no-exist');

  const compiled = await compile(entry.template, entry);
  return handleCompileErrorRoutes(req, res, compiled, entry.template);
});

module.exports = router;
