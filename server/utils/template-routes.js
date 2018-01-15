const mongoose = require('mongoose');
const express = require('express');
const compile = require('./compile');
const getEntryData = require('./get-entry-data');
const handleCompileErrorRoutes = require('./handle-compile-error-routes');

const Page = mongoose.model('Page');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const homepage = await Page.findOne({ homepage: true }).lean().exec();
  if (!homepage) {
    return handleCompileErrorRoutes(req, res, 'no-homepage');
  }

  try {
    const compiled = await compile(homepage.template, homepage);
    return compiled;
  } catch (err) { return next(err); }
});

router.get('*', async (req, res, next) => {
  const page = await Page.findOne({ route: req.originalUrl }).lean().exec();
  if (!page) return next();

  try {
    const compiled = await compile(page.template, page);
    return res.send(compiled);
  } catch (err) {
    return handleCompileErrorRoutes(req, res, 'no-template', page.template);
  }
});

router.get('/:section/:slug', async (req, res, next) => {
  const entry = await getEntryData(req.params);
  if (!entry) return next();

  try {
    const compiled = await compile(entry.template, entry);
    return handleCompileErrorRoutes(req, res, compiled, entry.template);
  } catch (err) { return next(err); }
});

/*
* 404
*/
router.use((req, res) => handleCompileErrorRoutes(req, res, 'no-exist'));

/*
* Error handler route
*/
router.use(async (err, req, res) => {
  const compiled = await compile('server-error.njk', { error: err, stack: err.stack });
  return res.status(500).send(compiled);
});

module.exports = router;
