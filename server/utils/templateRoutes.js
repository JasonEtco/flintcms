const mongoose = require('mongoose');
const express = require('express');
const compile = require('./compile');
const getEntryData = require('./getEntryData');
const handleCompileErrorRoutes = require('./handleCompileErrorRoutes');

const Page = mongoose.model('Page');
const router = express.Router();

router.get('/', async (req, res) => {
  const homepage = await Page.findOne({ homepage: true }).lean().exec();
  if (!homepage) return handleCompileErrorRoutes(req, res, 'no-homepage');

  const compiled = await compile(homepage.template, homepage)
    .catch(console.log); // eslint-disable-line no-console
  return res.send(compiled);
});

router.get('*', async (req, res, next) => {
  const page = await Page.findOne({ route: req.originalUrl }).lean().exec();
  if (!page) return next();

  const compiled = await compile(page.template, page);
  return handleCompileErrorRoutes(req, res, compiled, page.template);
});

router.get('/:section/:slug', async (req, res, next) => {
  const entry = await getEntryData(req.params);
  if (!entry) return next();

  const compiled = await compile(entry.template, entry);
  return handleCompileErrorRoutes(req, res, compiled, entry.template);
});

router.use((req, res) => handleCompileErrorRoutes(req, res, 'no-exist'));

module.exports = router;
